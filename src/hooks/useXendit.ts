// hooks/xendit/useCreateInvoice.ts
import { useMutation } from '@tanstack/react-query';
import { useVillageByAdmin } from './use-village-admin';
import useUserContext from './useUserContext';
import { createInvoiceApi } from '@/services/xenditService';

interface CreateInvoiceInput {
  amount: number;
  payer_email?: string;
  description: string;
  purpose?: string;
}

export const useCreateInvoice = () => {
  const { user } = useUserContext();
  const { data: villageData } = useVillageByAdmin();

  const villageId = villageData?.id;

  return useMutation({
    mutationFn: async ({
      amount,
      payer_email,
      description,
      purpose,
    }: CreateInvoiceInput) => {
      if (!villageId) {
        throw new Error('Village ID not found.');
      }

      if (!user?.id) {
        throw new Error('User not found.');
      }

      return await createInvoiceApi({
        amount,
        purpose: purpose || '',
        payer_email: user?.user_email || payer_email || '',
        description,
        village_id: villageId,
        user_id: user.id,
      });
    },
  });
};
