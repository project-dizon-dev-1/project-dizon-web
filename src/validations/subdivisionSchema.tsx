import { z } from "zod";

const phaseSchema = z.object({
  name: z.string().min(1, "Phase name is required"),
});

type PhaseFormValues = z.infer<typeof phaseSchema>;

const streetSchema = z.object({
  name: z.string().min(1, "Street name is required"),
});

type StreetFormValues = z.infer<typeof streetSchema>;

const blockSchema = z.object({
  name: z.string().min(1, "Block name is required"),
});

type BlockFormValues = z.infer<typeof blockSchema>;

const lotSchema = z.object({
  name: z.string().min(1, "Lot name is required"),
});

type LotFormValues = z.infer<typeof lotSchema>;

export { phaseSchema, streetSchema, blockSchema, lotSchema };

export type {
  PhaseFormValues,
  StreetFormValues,
  BlockFormValues,
  LotFormValues,
};
