import { z } from "zod";

const allowedMimeTypes = ["image/jpeg", "image/png"];

const collectionSchema = z.object({
  houseLatestPaymentAmount: z.coerce
    .number()
    .min(0, "Amount must be greater than 0"), // z.coerce.number() ensures string input is converted to a number
  housePaymentMonths: z.number().min(1, ""),
  housePaymentRemarks: z.string().optional(),
  paymentProof: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB"
    )
    .refine(
      (file) => allowedMimeTypes.includes(file.type),
      "Invalid file type. Allowed: jpg, jpeg, png"
    )

    .optional(),
});

const configureCollectionSchema = z.object({
  dayOfMonth: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "Day must be at least 1")
    .max(31, "Day cannot be more than 31"),
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  gracePeriod: z.coerce
    .number({
      required_error: "Grace period is required",
      invalid_type_error: "Grace period must be a number",
    })
    .int("Grace period must be a whole number"),
});
type CollectionType = z.infer<typeof collectionSchema>;
type configureCollectionSchemaType = z.infer<typeof configureCollectionSchema>;
export type { CollectionType, configureCollectionSchemaType };
export { collectionSchema, configureCollectionSchema };
