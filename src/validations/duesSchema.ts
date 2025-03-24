import z from "zod";

const dueSchema = z.object({
  dueName: z.string().min(1, "Due name is required."),
  dueDescription: z.string().optional(),
  dueCost: z.number().min(1, "Amount must be greater than 0"),
});

const categorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required."),
});

type CategoryType = z.infer<typeof categorySchema>;
type dueType = z.infer<typeof dueSchema>;

export { dueSchema, categorySchema };
export type { dueType, CategoryType };
