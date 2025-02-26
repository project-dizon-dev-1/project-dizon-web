import { z } from "zod";

const collectionSchema = z.object({
    houseLatestPaymentAmount: z.coerce.number().min(0, "Amount must be greater than 0"), // z.coerce.number() ensures string input is converted to a number
    housePaymentMonths: z.number().min(1,""),
    housePaymentRemarks: z.string().optional()
});

type CollectionType = z.infer<typeof collectionSchema>;

export type { CollectionType };
export { collectionSchema };
