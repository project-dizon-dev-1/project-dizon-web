import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/types/database';
import {
  getVillageRequestByEmail,
  createVillageRequest,
} from '@/services/villageService';
import { toast } from './use-toast';
import { VillageFormType } from '@/components/VillageForm';

type VillageRequest = Database['public']['Tables']['village-requests']['Row'];

export const useVillageRequestByEmail = (email?: string) => {
  return useQuery<VillageRequest | null>({
    queryKey: ['village-request', email],
    queryFn: () => getVillageRequestByEmail(email!),
    enabled: !!email, // only fetch if email exists
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};

export const useSubmitVillageRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      formData: VillageFormType;
      userEmail: string;
      userId: string;
    }) =>
      createVillageRequest({
        name: data.formData.villageName,
        village_address: data.formData.villageAddress,
        requester_email: data.userEmail,
        user_id: data.userId,
        status: 'pending',
        // address is optional, add if you have it in formData
        // address: data.formData.address,
      }),
    onSuccess: () => {
      toast({
        title: 'Village Request Submitted',
        description: 'Your village request has been sent successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['village-request'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Submit Request',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
