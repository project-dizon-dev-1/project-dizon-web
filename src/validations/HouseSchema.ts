import z from "zod";

const houseSchema = z.object({
  familyName: z.string().min(1, "Family name is required"),
  phase: z.string().min(1, "Phase is required"),
  street: z.string().min(1, "Phase is required"),
  block: z.string().min(1, "Phase is required"),
  lot: z.string().min(1, "Phase is required"),
  mainContact: z.string().optional(),
  latestPayment: z.date().optional(),
});

type HouseSchemaType = z.infer<typeof houseSchema>;

export type { HouseSchemaType };

export { houseSchema };
