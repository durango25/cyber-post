"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";
import { ArrowLeft, PlusCircle, ImageIcon, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { postSchema, type PostFormData } from "@/schemes/post";
import ErrorAlert, { type ErrorPayload } from "@/components/ErrorAlert";
import TiptapEditor from "@/components/TiptapEditor";

export default function CreatePostPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<ErrorPayload | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({ resolver: zodResolver(postSchema), defaultValues: { title: "", content: "" } });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
  };

  const onSubmit = async (data: PostFormData) => {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.image) formData.append("image", data.image as File);

      await api.post("/posts", formData);
      router.push("/dashboard/posts");
      router.refresh();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      if (data?.errors) {
        setServerError({ message: data.message, errors: data.errors });
      } else {
        setServerError(data?.message ?? "Gagal membuat postingan. Coba lagi.");
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Link href="/dashboard/posts" className="btn btn-ghost btn-sm btn-circle">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Buat Post</h1>
          <p className="text-base-content/50 text-sm">Tulis dan terbitkan postingan baru.</p>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm max-w-2xl">
        <div className="card-body gap-5">
          {serverError && (
            <ErrorAlert error={serverError} onClose={() => setServerError(null)} />
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Judul</legend>
              <input
                type="text"
                placeholder="Masukkan judul postingan"
                className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
                {...register("title")}
              />
              {errors.title && (
                <p className="fieldset-label text-error text-xs mt-1">{errors.title.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Konten</legend>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    hasError={!!errors.content}
                  />
                )}
              />
              {errors.content && (
                <p className="fieldset-label text-error text-xs mt-1">{errors.content.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Gambar </legend>
              {imagePreview ? (
                <div className="relative w-full rounded-box overflow-hidden border border-base-300">
                  <Image
                    src={imagePreview}
                    alt="Pratinjau gambar"
                    width={800}
                    height={400}
                    className="w-full object-cover max-h-64"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                    aria-label="Hapus gambar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-base-300 rounded-box p-8 cursor-pointer hover:border-primary transition-colors">
                  <ImageIcon className="w-8 h-8 text-base-content/30" />
                  <span className="text-sm text-base-content/50">Klik untuk unggah gambar</span>
                  <span className="text-xs text-base-content/30">JPG, JPEG, PNG maks. 1MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
              {errors.image && (
                <p className="fieldset-label text-error text-xs mt-1">
                  {errors.image.message as string}
                </p>
              )}
            </fieldset>

            <div className="flex gap-3 justify-end">
              <Link href="/dashboard/posts" className="btn btn-ghost">
                Batal
              </Link>
              <button
                type="submit"
                className="btn btn-primary gap-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Terbitkan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

