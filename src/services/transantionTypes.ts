type TransactionDataType = {
  id: string;
  category: string;
  amount: number;
  type: string;
  created_at: Date;
  details: string | null;
  response_by: string | null;
  response_date: Date | null;
  payment_method: string | null;
  proof_url: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";

  response_by_details: {
    user_first_name: string | null;
    user_last_name: string | null;
  } | null;
  received_by_details: {
    user_first_name: string | null;
    user_last_name: string | null;
  } | null;
};

export type { TransactionDataType };
