import z from "zod";

const houseSchema = z.object({
  phase: z.string().min(1, "Phase is required"),
  street: z.string().min(1, "Street is required"),
  block: z.string().min(1, "Block is required"),
  lot: z.array(z.string().min(1, "Lot is required")),
  mainLot: z.string().min(1, "Main lot is required"),
});

type HouseSchemaType = z.infer<typeof houseSchema>;

export type { HouseSchemaType };

export { houseSchema };
