import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@iconify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import useUserContext from '@/hooks/useUserContext';
import { usePhaseContext } from '@/context/phaseContext';
import { getHouses } from '@/services/houseServices';
import {
  fetchBlocksByPhase,
  fetchStreetsByPhase,
} from '@/services/subdivisionServices';
import { useVillageByAdmin } from '@/hooks/use-village-admin';

import {
  useSubmitVillageRequest,
  useVillageRequestByEmail,
} from '@/hooks/useVillageRequest';
import { VillageForm, VillageFormType } from '@/components/VillageForm';
import { useCreateInvoice, usePollInvoiceStatus } from '@/hooks/useXendit';
import { toast } from '@/hooks/use-toast';
import { useUpdateVillage } from '@/hooks/useUpdateVillage';

const VillageDashboard = () => {
  const { user } = useUserContext();
  const { phases } = usePhaseContext();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    village_name: '',
    village_address: '',
    village_description: '',
    village_logo: null as File | null,
  });

  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);

  const { data: villageData, isLoading: villageLoading } = useVillageByAdmin();

  const { mutate: updateVillage, isPending: isUpdating } = useUpdateVillage();

  const { data: villageRequest, isLoading: requestLoading } =
    useVillageRequestByEmail(user?.user_email, {
      enabled: !villageLoading && !villageData,
    });

  const { mutate: submitRequest } = useSubmitVillageRequest();
  const { mutate: createInvoice, isPending: isCreatingInvoice } =
    useCreateInvoice();
  const { data: invoiceStatus } = usePollInvoiceStatus(currentInvoiceId);

  const villageId = villageData?.id;

  const { data: houseData, isLoading: housesLoading } = useQuery({
    queryKey: ['houses-summary', villageId],
    queryFn: async () => await getHouses({ page: '1', village: villageId }),
    enabled: !!villageId && !!villageData,
  });

  const { data: streetsData, isLoading: streetsLoading } = useQuery({
    queryKey: ['village-streets', villageId],
    queryFn: async () =>
      (await Promise.all(phases.map((p) => fetchStreetsByPhase(p.id)))).flat(),
    enabled: !!villageId && !!villageData && phases.length > 0,
  });

  const { data: blocksData, isLoading: blocksLoading } = useQuery({
    queryKey: ['village-blocks', villageId],
    queryFn: async () =>
      (await Promise.all(phases.map((p) => fetchBlocksByPhase(p.id)))).flat(),
    enabled: !!villageId && !!villageData && phases.length > 0,
  });

  const loading =
    villageLoading ||
    housesLoading ||
    streetsLoading ||
    blocksLoading ||
    requestLoading;

  // Sync form data when entering edit mode
  useEffect(() => {
    if (villageData && isEditing) {
      setEditData({
        village_name: villageData.village_name || '',
        village_address: villageData.village_address || '',
        village_description: villageData.village_description || '',
        village_logo: null,
      });
    }
  }, [villageData, isEditing]);

  // Handle invoice updates
  useEffect(() => {
    if (invoiceStatus) {
      if (
        invoiceStatus.status === 'PAID' ||
        invoiceStatus.status === 'SETTLED'
      ) {
        toast({
          title: 'Payment Successful',
          description: 'Your subscription has been renewed!',
        });
        queryClient.invalidateQueries({
          queryKey: ['village-by-admin'],
        });
        setCurrentInvoiceId(null);
      } else if (invoiceStatus.status === 'EXPIRED') {
        toast({
          title: 'Payment Expired',
          description: 'The payment window has expired. Please try again.',
          variant: 'destructive',
        });
        setCurrentInvoiceId(null);
      }
    }
  }, [invoiceStatus, queryClient, user?.id]);

  // Handlers
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

  const handleSubscriptionPayment = () => {
    createInvoice(
      {
        amount: 1000,
        description: 'Village Subscription Renewal',
        purpose: 'subscription',
      },
      {
        onSuccess: (response) => {
          const invoiceUrl = response?.data?.invoice_url;
          const invoiceId = response?.data?.id;
          if (invoiceUrl && invoiceId) {
            setCurrentInvoiceId(invoiceId);
            window.open(invoiceUrl, '_blank', 'width=800,height=600');
            toast({
              title: 'Success',
              description:
                'Payment window opened. We will notify you when payment is complete.',
            });
          } else {
            toast({
              title: 'Error',
              description: 'Invoice URL not found in response.',
              variant: 'destructive',
            });
          }
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to create invoice.';
          toast({
            title: 'Payment Error',
            description: msg,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleUpdateSubmit = () => {
    if (!villageId) return;
    const formData = new FormData();
    formData.append('village_name', editData.village_name);
    formData.append('village_address', editData.village_address);
    formData.append('village_description', editData.village_description);
    if (editData.village_logo)
      formData.append('village_logo', editData.village_logo);

    updateVillage({ id: villageId, formData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      village_name: '',
      village_address: '',
      village_description: '',
      village_logo: null,
    });
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

  if (!villageData && !villageRequest) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full">
        <VillageForm onSubmit={handleVillageRequestSubmit} />
      </div>
    );
  }

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

  // ✅ Main Render
  return (
    <div className="w-full p-6 space-y-8 overflow-y-auto no-scrollbar">
      {/* Header with Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Village Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your village information and view statistics
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="gap-2"
          >
            <Icon icon="mdi:pencil-outline" className="h-4 w-4" />
            Edit Village
          </Button>
        )}
      </div>

      {/* Stats Section - Moved to top for better hierarchy */}
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

      {/* Village Information Card */}
      <Card className="border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Village Information
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {isEditing ? (
            // Edit Mode - Clean Form Layout
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Village Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Village Name *
                  </label>
                  <Input
                    value={editData.village_name}
                    onChange={(e) =>
                      setEditData({ ...editData, village_name: e.target.value })
                    }
                    placeholder="Enter village name"
                    className="w-full"
                  />
                </div>

                {/* Village Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <Input
                    value={editData.village_address}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        village_address: e.target.value,
                      })
                    }
                    placeholder="Enter village address"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  value={editData.village_description}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      village_description: e.target.value,
                    })
                  }
                  placeholder="Enter village description"
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Village Logo
                </label>
                <div className="flex items-center gap-4">
                  {villageData.village_logo_url && !editData.village_logo && (
                    <img
                      src={villageData.village_logo_signed_url}
                      alt="Current Logo"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          village_logo: e.target.files?.[0] || null,
                        })
                      }
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editData.village_logo
                        ? `Selected: ${editData.village_logo.name}`
                        : 'Upload a new logo to replace the current one'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateSubmit}
                  disabled={isUpdating}
                  className="gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Icon
                        icon="mdi:loading"
                        className="h-4 w-4 animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:check" className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // View Mode - Clean Display Layout
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Village Name */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Village Name
                  </p>
                  <p className="text-base text-gray-900">
                    {villageData.village_name || '—'}
                  </p>
                </div>

                {/* Created Date */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Created On
                  </p>
                  <p className="text-base text-gray-900">
                    {villageData.created_at
                      ? new Date(villageData.created_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )
                      : '—'}
                  </p>
                </div>

                {/* Address */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Address
                  </p>
                  <p className="text-base text-gray-900">
                    {villageData.village_address || '—'}
                  </p>
                </div>

                {/* Village Logo */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Village Logo
                  </p>
                  {villageData.village_logo_url ? (
                    <img
                      src={villageData.village_logo_signed_url}
                      alt="Village Logo"
                      className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <Icon
                        icon="mdi:image-off-outline"
                        className="h-8 w-8 text-gray-400"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description - Full Width */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Description
                </p>
                <p className="text-base text-gray-900 leading-relaxed">
                  {villageData.village_description || 'No description provided'}
                </p>
              </div>

              {/* Subscription Section */}
              {villageData.subscription_expiration && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Subscription Status
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Expires on{' '}
                        {new Date(
                          villageData.subscription_expiration
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Button
                      onClick={handleSubscriptionPayment}
                      disabled={isCreatingInvoice || !!currentInvoiceId}
                      className="gap-2"
                    >
                      {isCreatingInvoice || currentInvoiceId ? (
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
                          Renew Subscription
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VillageDashboard;

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
  <Card
    className={cn(
      'rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow'
    )}
  >
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div
        className={cn(
          'flex items-center justify-center h-14 w-14 rounded-xl',
          color || 'bg-gray-100 text-gray-700'
        )}
      >
        <Icon icon={icon} className="h-7 w-7" />
      </div>
    </CardContent>
  </Card>
);
