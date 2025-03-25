type TransactionDataType = {
  id: string;
  category: string;
  amount: number;
  type: string;
  created_at: Date;
  details: string;
  approved_by: string | null;
  approve_date: Date | null;
  payment_method: string;
  proof_url: string | null;
  approved_by_details: {
    user_first_name: string | null;
    user_last_name: string | null;
  } | null;
  received_by_details: {
    user_first_name: string | null;
    user_last_name: string | null;
  } | null;
};

export type { TransactionDataType };
