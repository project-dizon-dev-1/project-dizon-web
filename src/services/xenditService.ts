import { axiosGet, axiosPost } from '@/lib/axios';
// import { supabase } from './supabaseClient';

// ---------- Types ----------

export interface CreateInvoicePayload {
  village_id: string;
  user_id: string;
  amount: number;
  payer_email: string;
  description: string;
  purpose: string;
}

export interface CreateDueInvoicePayload extends CreateInvoicePayload {
  house_id: string;
  purpose: string;
  months: string[]; // assuming months are string values like ["January", "February"]
}

export interface XenditPayment {
  id: string;
  created_at: string;
  amount: number;
  details: string;
  status: string;
  external_id: string;
  village_id: string;
  house_id?: string;
  user_id?: string;
}

export interface FormattedDuePayment {
  id: string;
  month: string;
  half: '1st Half' | '2nd Half';
  amount: number;
  details: string;
  status: string;
  created_at: string;
  formatted: string;
}

// ---------- API Calls ----------

export const createInvoiceApi = async ({
  village_id,
  purpose,
  user_id,
  amount,
  payer_email,
  description,
}: CreateInvoicePayload) => {
  console.log('=== CREATE INVOICE API PARAMS ===');
  console.log('village_id:', village_id);
  console.log('purpose:', purpose);
  console.log('user_id:', user_id);
  console.log('amount:', amount);
  console.log('payer_email:', payer_email);
  console.log('description:', description);
  console.log('================================');

  return await axiosPost('/xendit/create-invoice', {
    amount,
    purpose,
    payer_email,
    description,
    village_id,
    user_id,
  });
};
export const createDueInvoiceApi = async ({
  village_id,
  house_id,
  user_id,
  amount,
  payer_email,
  description,
  purpose,
  months,
}: CreateDueInvoicePayload) => {
  return await axiosPost('/xendit/create-due-invoice', {
    amount,
    payer_email,
    description,
    purpose,
    village_id,
    house_id,
    user_id,
    months,
  });
};

export const getInvoiceStatusApi = async (invoiceId: string) => {
  return await axiosGet(`/xendit/invoices/${invoiceId}`);
};

// ---------- Supabase Fetch ----------

// export const fetchFormattedDuePayments = async (
//   villageId: string
// ): Promise<FormattedDuePayment[]> => {
//   console.log(
//     '📦 [fetchFormattedDuePayments] Called with villageId:',
//     villageId
//   );

//   if (!villageId) {
//     console.log('⚠️ No villageId provided — returning empty array');
//     return [];
//   }

//   const { data, error } = await supabase
//     .from<XenditPayment>('xendit-payments')
//     .select('*')
//     .eq('village_id', villageId)
//     .like('external_id', 'due_%')
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error('❌ Error fetching due payments:', error.message);
//     throw new Error(error.message);
//   }

//   console.log('✅ Raw data fetched from Supabase:', data);

//   const formatted = (data ?? []).map((payment): FormattedDuePayment => {
//     const createdAt = new Date(payment.created_at);
//     const monthName = createdAt.toLocaleString('default', {
//       month: 'long',
//       year: 'numeric',
//     });
//     const day = createdAt.getDate();
//     const half = day <= 15 ? '1st Half' : '2nd Half';

//     return {
//       id: payment.id,
//       month: monthName,
//       half,
//       amount: payment.amount,
//       details: payment.details,
//       status: payment.status,
//       created_at: payment.created_at,
//       formatted: `${monthName} — ${half} — ₱${payment.amount.toLocaleString()}`,
//     };
//   });

//   console.log('🧩 Formatted due payments:', formatted);

//   return formatted;
// };
