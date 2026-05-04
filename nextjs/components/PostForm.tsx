"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { postSchema, type PostFormValues } from "@/schemes/post";

const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <div className="skeleton h-48 w-full rounded-lg" /> },
);

// ─── Props ───────────────────────────────────────────────────────────────────

interface PostFormProps {
  /** Initial values for edit mode */
  defaultValues?: Partial<PostFormValues>;
  /** Existing image URL to preview in edit mode */
  currentImageUrl?: string | null;
  /** Called with FormData containing title, content, and optionally main_image */
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
  rootError?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PostForm({
  defaultValues,
  currentImageUrl,
  onSubmit,
  submitLabel = "Submit",
  rootError,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues,
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const imageSrc = preview ?? currentImageUrl ?? null;

  const submit = async (values: PostFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    if (selectedFile) formData.append("main_image", selectedFile);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      {rootError && (
        <div role="alert" className="alert alert-error text-sm py-2">
          {rootError}
        </div>
      )}

      {/* Title */}
      <label className="form-control">
        <div className="label">
          <span className="label-text">Title</span>
        </div>
        <input
          type="text"
          className={`input input-bordered ${errors.title ? "input-error" : ""}`}
          maxLength={255}
          {...register("title")}
        />
        {errors.title && (
          <div className="label">
            <span className="label-text-alt text-error">{errors.title.message}</span>
          </div>
        )}
      </label>

      {/* Content */}
      <div className="form-control">
        <div className="label">
          <span className="label-text">Content</span>
        </div>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              hasError={!!errors.content}
            />
          )}
        />
        {errors.content && (
          <div className="label">
            <span className="label-text-alt text-error">{errors.content.message}</span>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="form-control">
        <div className="label">
          <span className="label-text">Cover Image (optional)</span>
          {currentImageUrl && !preview && (
            <span className="label-text-alt opacity-50">Current image shown below</span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={handleImageChange}
        />
        {imageSrc && (
          <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-base-300">
            <Image src={imageSrc} alt="Cover preview" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : submitLabel}
        </button>
      </div>
    </form>
  );
}
