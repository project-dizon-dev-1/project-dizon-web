import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from './use-toast';
import { updateVillage } from '@/services/villageService';

export const useUpdateVillage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; formData: FormData }) => {
      return await updateVillage(data.id, data.formData);
    },

    onSuccess: (_, variables) => {
      toast({
        title: 'Village Updated',
        description: 'The village information has been successfully updated.',
      });

      // Invalidate both the main and user-specific queries
      queryClient.invalidateQueries({ queryKey: ['village-by-admin'] });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: ['village-by-admin', variables.id],
        });
      }
    },

    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description:
          error?.response?.data?.message ||
          error.message ||
          'An error occurred while updating the village.',
        variant: 'destructive',
      });
    },
  });
};
