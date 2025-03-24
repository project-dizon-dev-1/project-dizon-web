import { z } from "zod";

// Define payment method type as a literal union
type PaymentMethodType = "CASH" | "BANK" | "ONLINE";
type CategoryType = "EXPENSE" | "INCOME";
// Create a proper tuple with 'as const' assertion for Zod enum
const PAYMENT_METHOD_VALUES = ["CASH", "BANK", "ONLINE"] as const;

const CATEGORY_TYPE_VALUES = ["EXPENSE", "INCOME"] as const;

const allowedMimeTypes = ["image/jpeg", "image/png"];

const transactionSchema = z.object({
  type: z.enum(CATEGORY_TYPE_VALUES, {
    errorMap: () => ({
      message: `Category must be one of: ${CATEGORY_TYPE_VALUES.join(", ")}`,
    }),
  }),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  // Use enum validation with the exact payment method options
  payment_method_type: z.enum(PAYMENT_METHOD_VALUES, {
    errorMap: () => ({
      message: `Payment method must be one of: ${PAYMENT_METHOD_VALUES.join(
        ", "
      )}`,
    }),
  }),

  transactionProof: z
    .custom<File>((val) => val instanceof File, {
      message: "Please upload a transaction proof document",
    })
    .refine((file) => {
      if (!file) return false;
      return file.size <= 5 * 1024 * 1024;
    }, "Image size must be less than 5MB")
    .refine((file) => {
      if (!file) return false;
      return allowedMimeTypes.includes(file.type);
    }, "Invalid file type. Allowed: JPG, PNG only"),
});

type TransactionType = z.infer<typeof transactionSchema>;

export type { TransactionType, PaymentMethodType, CategoryType };
export { transactionSchema, PAYMENT_METHOD_VALUES };
