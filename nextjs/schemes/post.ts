import { z } from "zod";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

export const postSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  content: z
    .string()
    .refine((val) => stripHtml(val).length > 0, "Content is required."),
});

export type PostFormValues = z.infer<typeof postSchema>;
