import { z } from "zod";

const allowedMimeTypes = ["image/jpeg", "image/png"];

const collectionSchema = z.object({
  houseLatestPaymentAmount: z.coerce
    .number()
    .positive("Amount must be positive")
    .int("Amount must be a whole number")
    .min(1, "Amount must be greater than 0"),
  housePaymentMonths: z
    .number()
    .positive("Months must be positive")
    .int("Months must be a whole number")
    .min(1, " At least 1 month is required")
    .max(12, "Maximum 12 months"),
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

const configureCollectionSchema = z
  .object({
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
      .int("Grace period must be a whole number")
      .min(0, "Grace period cannot be negative"),
  })
  .superRefine((data, ctx) => {
    // Now we can access all fields through 'data'
    const { dayOfMonth, gracePeriod } = data;

    // Calculate the maximum allowed grace period
    const calculatedMaxGracePeriod = 28 - dayOfMonth;

    if (gracePeriod > calculatedMaxGracePeriod) {
      ctx.addIssue({
        path: ["gracePeriod"],
        code: z.ZodIssueCode.custom,
        message:
          calculatedMaxGracePeriod > 0
            ? `Grace period must be between 0 and ${calculatedMaxGracePeriod} days. (Current Day of Month is ${dayOfMonth})`
            : `Grace period must be 0 days when the day of month is ${dayOfMonth}.`,
      });
    }
  });

type CollectionType = z.infer<typeof collectionSchema>;
type configureCollectionSchemaType = z.infer<typeof configureCollectionSchema>;
export type { CollectionType, configureCollectionSchemaType };
export { collectionSchema, configureCollectionSchema };
