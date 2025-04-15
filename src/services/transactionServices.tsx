import { axiosGet, axiosPost, axiosPut } from "@/lib/axios";
import { PaginatedDataType } from "@/types/paginatedType";
import {
  CategoryType,
  PaymentMethodType,
} from "@/validations/transactionSchema";
import { TransactionDataType } from "./transantionTypes";

const addTransaction = async (data: {
  dueId?: string | undefined;
  userId: string;
  type: CategoryType;
  amount: number;
  category: string;
  description: string;
  payment_method_type: PaymentMethodType;
  transactionProof: File;
}) => {
  const formData = new FormData();

  if (data.dueId) {
    formData.append("dueId", data.dueId);
  }
  formData.append("type", data.type);
  formData.append("amount", data.amount.toString());
  formData.append("category", data.category);
  formData.append("userId", data.userId);
  formData.append("paymentMethod", data.payment_method_type);
  formData.append("transactionProof", data.transactionProof);
  formData.append("description", data.description);

  return await axiosPost("/transactions/add", formData);
};

const fetchTransactions = async ({
  page,
  pageSize,
}: {
  page: string;
  pageSize: string;
}): Promise<PaginatedDataType<TransactionDataType>> => {
  return await axiosGet("/transactions/", {
    params: { page, pageSize },
  });
};

const approveTransaction = async ({
  transactionId,
  userId,
}: {
  transactionId: string | undefined;
  userId: string | undefined;
}) => {
  return await axiosPut(`/transactions/${transactionId}/approve`, { userId });
};

export { addTransaction, fetchTransactions, approveTransaction };
