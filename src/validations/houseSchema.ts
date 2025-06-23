import { z } from "zod";

const houseSchema = z.object({
  familyName: z.string().min(1, "Family name is required"),
  phase: z.string().min(1, "Phase is required"),
  street: z.string().min(1, "Street is required"),
  block: z.string().min(1, "Block is required"),
  latestPaymentDate: z
    .string()
    .optional()
    .refine(
      (date) => !date || !isNaN(Date.parse(date)),
      "Latest payment date must be a valid date"
    ),
  latestPaymentAmount: z
    .number()
    .min(0, "Latest payment amount must be a positive number"),
  lot: z
    .array(z.string().min(1, "Lot is required"))
    .min(1, "At least one lot is required"),
  mainLot: z.string().min(1, "Main lot is required"),
});

type HouseSchemaType = z.infer<typeof houseSchema>;

export type { HouseSchemaType };

export { houseSchema };
