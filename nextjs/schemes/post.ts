import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Judul mohon diisi !")
    .max(255, "Judul maksimal 255 karakter !"),
  content: z.string()
    .min(10, "Konten minimal 10 karakter !"),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Ukuran gambar maksimal 1MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Format gambar harus JPG, JPEG, PNG, atau WebP"
    ),
});

export type PostFormData = z.infer<typeof postSchema>;
