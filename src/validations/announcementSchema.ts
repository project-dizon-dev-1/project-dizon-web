import z from "zod";

// Define maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const checkFileType = (file: File) => {
  if (!file?.name) return false;

  const fileType = file.name.split(".").pop()?.toLowerCase();
  const allowedTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "mp4",
    "avi",
    "mov",
    "pdf",
    "ppt",
    "pptx",
    "doc",
    "docx",
  ];

  return fileType ? allowedTypes.includes(fileType) : false;
};

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  phases: z
    .array(z.string().min(0, "Phase number must be valid"))
    .optional()
    .default([]),
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
      "Invalid file type. Allowed: .jpg, .jpeg, .png, .gif, .mp4, .avi, .mov, .pdf, .ppt, .pptx, .doc, .docx."
    ),
});

type AnnouncementSchemaType = z.infer<typeof announcementSchema>;

export { announcementSchema };
export type { AnnouncementSchemaType };
