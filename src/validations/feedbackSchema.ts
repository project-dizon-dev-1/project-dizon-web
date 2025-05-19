import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const checkFileType = (file: File) => {
  if (!file?.name) return false;

  const fileType = file.name.split(".").pop()?.toLowerCase();
  const allowedTypes = ["jpg", "jpeg", "png"];

  return fileType ? allowedTypes.includes(fileType) : false;
};
const feedbackSchema = z.object({
  feedback: z
    .string()
    .min(10, "Please provide at least 10 characters of feedback")
    .max(1000, "Feedback must be less than 1000 characters"),
  files: z
    .array(z.any())
    .max(3, "maximum of 3 files")
    .optional()
    .refine(
      (files) => !files || files.every((file) => file instanceof File),
      "Each file must be a valid File object"
    )
    .refine(
      (files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE),
      `Each file must not exceed 5MB`
    )
    .refine(
      (files) => !files || files.every((file) => checkFileType(file)),
      "Invalid file type. Allowed: .jpg, .jpeg, .png."
    ),
});

type FeedbackSchemaType = z.infer<typeof feedbackSchema>;
export { feedbackSchema };
export type { FeedbackSchemaType };
