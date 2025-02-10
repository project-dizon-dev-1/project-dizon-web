import z from "zod";

const dueSchema = z.object({
    dueName: z.string().min(1, "Due name is required."),
    dueDescription: z.string().optional(),
    dueCost: z.number().min(1, "Amount must be greater than 0"),
    dueIsActive: z.boolean(),
});

type dueType = z.infer<typeof dueSchema>; 
export { dueSchema };

export type { dueType }; 
