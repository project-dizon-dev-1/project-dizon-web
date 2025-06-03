import z from "zod";

// Define maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB in bytes

const checkFileType = (file: File) => {
  if (!file?.name) return false;

  const allowedTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/mp4",
    "image/avi",
    "image/mov",
    "image/pdf",
    "image/ppt",
    "image/pptx",
    "image/doc",
    "image/docx",
    "image/xlsx",
    "image/webp",
  ];

  return file ? allowedTypes.includes(file.type) : false;
};

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  phases: z
    .array(z.string().min(0, "Phase number is required"))
    .min(1, "At least one phase is required"),
  files: z
    .array(z.any())
    .max(10, "maximum of 10 files")
    .optional()
    .refine(
      (files) => !files || files.every((file) => file instanceof File),
      "Each file must be a valid File object"
    )
    .refine(
      (files) =>
        !files ||
        files.every((file) => {
          // If it's a video file, check against MAX_VIDEO_SIZE
          if (file.type.startsWith("video")) {
            return file.size <= MAX_VIDEO_SIZE;
          }
          // If it's not a video file, check against MAX_FILE_SIZE
          return file.size <= MAX_FILE_SIZE;
        }),
      `Video files must not exceed 50MB and other files must not exceed 5MB`
    )
    .refine(
      (files) => !files || files.every((file) => checkFileType(file)),
      "Invalid file type. Allowed: jpg, jpeg, png, gif, mp4, avi, mov, pdf, ppt, pptx, doc, docx, xlsx, webp"
    ),
});

type AnnouncementSchemaType = z.infer<typeof announcementSchema>;

export { announcementSchema };
export type { AnnouncementSchemaType };
