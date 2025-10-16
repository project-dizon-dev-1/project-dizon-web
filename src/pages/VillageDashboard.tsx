// VillageDashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVillageByAdmin } from '@/hooks/use-village-admin';
import { useQuery } from '@tanstack/react-query';
import { getHouses } from '@/services/houseServices';
import {
  fetchBlocksByPhase,
  fetchStreetsByPhase,
} from '@/services/subdivisionServices';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@iconify/react';
import { usePhaseContext } from '@/context/phaseContext';
import { cn } from '@/lib/utils';
import useUserContext from '@/hooks/useUserContext';
import {
  useVillageRequestByEmail,
  useSubmitVillageRequest,
} from '@/hooks/useVillageRequest';
import { VillageForm, VillageFormType } from '@/components/VillageForm';
import { toast } from '@/hooks/use-toast';
import { useCreateInvoice } from '@/hooks/useXendit';

const VillageDashboard = () => {
  const { user } = useUserContext();

  const { phases } = usePhaseContext();

  const { data: villageData, isLoading: villageLoading } = useVillageByAdmin();
  const { data: villageRequest, isLoading: requestLoading } =
    useVillageRequestByEmail(user?.user_email);

  // Add the submit mutation hook
  const { mutate: submitRequest } = useSubmitVillageRequest();
  const { mutate: createInvoice, isPending: isCreatingInvoice } =
    useCreateInvoice();

  const villageId = villageData?.id;

  const { data: houseData, isLoading: housesLoading } = useQuery({
    queryKey: ['houses-summary', villageId],
    queryFn: async () => await getHouses({ page: '1', village: villageId }),
    enabled: !!villageId,
  });

  const { data: streetsData, isLoading: streetsLoading } = useQuery({
    queryKey: ['village-streets', villageId],
    queryFn: async () =>
      (await Promise.all(phases.map((p) => fetchStreetsByPhase(p.id)))).flat(),
    enabled: !!villageId && phases.length > 0,
  });

  const { data: blocksData, isLoading: blocksLoading } = useQuery({
    queryKey: ['village-blocks', villageId],
    queryFn: async () =>
      (await Promise.all(phases.map((p) => fetchBlocksByPhase(p.id)))).flat(),
    enabled: !!villageId && phases.length > 0,
  });

  const loading =
    villageLoading ||
    housesLoading ||
    streetsLoading ||
    blocksLoading ||
    requestLoading;

  // Handle form submission
  const handleVillageRequestSubmit = (formData: VillageFormType) => {
    if (!user?.user_email || !user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit a village request.',
        variant: 'destructive',
      });
      return;
    }

    submitRequest({
      formData,
      userEmail: user.user_email,
      userId: user.id,
    });
  };

  // Handle subscription payment
  const handleSubscriptionPayment = () => {
    createInvoice(
      {
        amount: 1000, // Adjust amount as needed
        description: 'Village Subscription Renewal',
        purpose: 'subscription',
      },
      {
        onSuccess: (response) => {
          // Backend returns { message, data: { ...xenditResponse } }
          // Xendit response contains invoice_url
          const invoiceUrl = response?.data?.invoice_url;

          console.log('Full response:', response);
          console.log('Invoice URL:', invoiceUrl);

          if (invoiceUrl) {
            window.open(invoiceUrl, '_blank', 'width=800,height=600');
            toast({
              title: 'Success',
              description:
                'Payment window opened. Please complete your payment.',
            });
          } else {
            console.error('Invoice response:', response);
            toast({
              title: 'Error',
              description: 'Invoice URL not found in response.',
              variant: 'destructive',
            });
          }
        },
        onError: (error) => {
          console.error('Invoice creation error:', error);
          toast({
            title: 'Payment Error',
            description:
              error instanceof Error
                ? error.message
                : 'Failed to create invoice.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[150px] rounded-xl" />
        ))}
      </div>
    );
  }

  // Village exists
  if (villageData) {
    return (
      <div className="w-full p-6 space-y-8 overflow-y-auto no-scrollbar">
        <Card className="border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {villageData.village_name || '—'}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Created on{' '}
                {villageData.created_at
                  ? new Date(villageData.created_at).toLocaleDateString()
                  : '—'}
              </p>
            </div>
            {villageData.village_logo_url ? (
              <img
                src={villageData.village_logo_url}
                alt="Village Logo"
                className="h-16 w-16 rounded-lg object-cover border border-gray-100"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400">
                <Icon icon="mdi:image-off-outline" className="h-7 w-7" />
              </div>
            )}
          </CardHeader>
          <CardContent className="text-gray-600 text-sm space-y-2">
            <p>
              <strong>Address:</strong> {villageData.village_address || '—'}
            </p>
            {villageData.village_description && (
              <p>
                <strong>Description:</strong> {villageData.village_description}
              </p>
            )}
            {villageData.subscription_expiration && (
              <div className="flex items-center gap-3">
                <p>
                  <strong>Subscription Expiration:</strong>{' '}
                  {new Date(
                    villageData.subscription_expiration
                  ).toLocaleDateString()}
                </p>
                <button
                  onClick={handleSubscriptionPayment}
                  disabled={isCreatingInvoice}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center gap-1"
                >
                  {isCreatingInvoice ? (
                    <>
                      <Icon
                        icon="mdi:loading"
                        className="h-4 w-4 animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon
                        icon="mdi:credit-card-outline"
                        className="h-4 w-4"
                      />
                      Renew
                    </>
                  )}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardStat
            icon="mingcute:home-3-line"
            title="Total Houses"
            value={houseData?.totalItems || 0}
            color="bg-blue-100 text-blue-700"
          />
          <DashboardStat
            icon="mdi:map-marker-radius-outline"
            title="Total Phases"
            value={phases.length}
            color="bg-green-100 text-green-700"
          />
          <DashboardStat
            icon="mdi:road-variant"
            title="Total Streets"
            value={streetsData?.length || 0}
            color="bg-orange-100 text-orange-700"
          />
          <DashboardStat
            icon="mdi:view-grid-outline"
            title="Total Blocks"
            value={blocksData?.length || 0}
            color="bg-purple-100 text-purple-700"
          />
        </div>
      </div>
    );
  }

  // Pending request
  if (villageRequest) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 space-y-4">
        <Icon icon="mdi:clock-outline" className="h-12 w-12 text-gray-400" />
        <p className="text-lg">Your village request is pending approval.</p>
        <p className="text-sm text-gray-400">
          Status:{' '}
          <span className="font-medium capitalize">
            {villageRequest.status}
          </span>
        </p>
      </div>
    );
  }

  // No village/request → show form
  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full">
      <VillageForm onSubmit={handleVillageRequestSubmit} />
    </div>
  );
};

export default VillageDashboard;

// Reusable Stat Card
const DashboardStat = ({
  icon,
  title,
  value,
  color,
}: {
  icon: string;
  title: string;
  value: number | string;
  color?: string;
}) => (
  <Card className={cn('rounded-2xl border border-gray-100 shadow-sm')}>
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div
        className={cn(
          'flex items-center justify-center h-12 w-12 rounded-xl',
          color || 'bg-gray-100 text-gray-700'
        )}
      >
        <Icon icon={icon} className="h-6 w-6" />
      </div>
    </CardContent>
  </Card>
);
