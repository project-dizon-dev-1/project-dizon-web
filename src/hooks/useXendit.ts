// hooks/useXendit.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useVillageByAdmin } from './use-village-admin';
import useUserContext from './useUserContext';
import {
  createInvoiceApi,
  createDueInvoiceApi,
  getInvoiceStatusApi,
  CreateDueInvoicePayload,
} from '@/services/xenditService';

// ---------- Types ----------
interface CreateInvoiceInput {
  amount: number;
  payer_email?: string;
  description: string;
  purpose?: string;
}

interface InvoiceStatus {
  id: string;
  status: 'PENDING' | 'PAID' | 'SETTLED' | 'EXPIRED';
  amount: number;
  description: string;
  invoice_url: string;
  expiry_date: string;
  paid_at?: string;
  [key: string]: any;
}

// ---------- Create Invoice Hook ----------
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

// ---------- Create Due Invoice Hook ----------
export const useCreateDueInvoice = () => {
  const { user } = useUserContext();
  const { data: villageData } = useVillageByAdmin();
  const villageId = villageData?.id;

  return useMutation({
    mutationFn: async ({
      house_id,
      amount,
      description,
      purpose,
      months,
    }: {
      house_id: string;
      amount: number;
      description: string;
      purpose: string;
      months: string[];
    }) => {
      if (!villageId) {
        throw new Error('Village ID not found.');
      }
      if (!user?.id) {
        throw new Error('User not found.');
      }

      const payload: CreateDueInvoicePayload = {
        village_id: villageId,
        house_id,
        user_id: user.id,
        amount,
        payer_email: user.user_email || '',
        description,
        purpose,
        months,
      };

      return await createDueInvoiceApi(payload);
    },
  });
};

// ---------- Invoice Status Hooks ----------

// Hook to fetch invoice status
export const useInvoiceStatus = (
  invoiceId: string | null,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery<InvoiceStatus>({
    queryKey: ['invoice-status', invoiceId],
    queryFn: async () => {
      if (!invoiceId) throw new Error('Invoice ID is required');
      const response = await getInvoiceStatusApi(invoiceId);
      return response as InvoiceStatus;
    },
    enabled: !!invoiceId && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  });
};

// Hook to poll invoice status until paid
export const usePollInvoiceStatus = (invoiceId: string | null) => {
  return useQuery<InvoiceStatus>({
    queryKey: ['invoice-status-poll', invoiceId],
    queryFn: async () => {
      if (!invoiceId) throw new Error('Invoice ID is required');
      const response = await getInvoiceStatusApi(invoiceId);
      return response as InvoiceStatus;
    },
    enabled: !!invoiceId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling if invoice is paid, settled, or expired
      if (
        data?.status === 'PAID' ||
        data?.status === 'SETTLED' ||
        data?.status === 'EXPIRED'
      ) {
        return false;
      }
      // Poll every 5 seconds while pending
      return 5000;
    },
  });
};

// Hook to manually check invoice status
export const useCheckInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await getInvoiceStatusApi(invoiceId);
      return response as InvoiceStatus;
    },
    onSuccess: (invoiceId) => {
      // Invalidate and refetch invoice status query
      queryClient.invalidateQueries({
        queryKey: ['invoice-status', invoiceId],
      });
    },
  });
};
