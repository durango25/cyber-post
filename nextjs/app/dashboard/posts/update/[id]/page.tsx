"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import type { Post } from "@/types/post";
import { ArrowLeft, Save, ImageIcon, X } from "lucide-react";
import { postSchema, type PostFormData } from "@/schemes/post";
import ErrorAlert, { type ErrorPayload } from "@/components/ErrorAlert";
import TiptapEditor from "@/components/TiptapEditor";

export default function UpdatePostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [serverError, setServerError] = useState<ErrorPayload | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({ resolver: zodResolver(postSchema) });

  useEffect(() => {
    api
      .get<{ data: Post }>(`/posts/${id}`)
      .then((res) => {
        const post = res.data.data;
        reset({ title: post.title, content: post.content });
        setCurrentImage(post.image_url ?? null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setFetchLoading(false));
  }, [id, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeNewImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
  };

  const onSubmit = async (data: PostFormData) => {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("_method", "PUT"); // Laravel method spoofing
      if (data.image) formData.append("image", data.image as File);

      await api.post(`/posts/${id}`, formData);
      router.push(`/dashboard/posts/detail/${id}`);
      router.refresh();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      if (data?.errors) {
        setServerError({ message: data.message, errors: data.errors });
      } else {
        setServerError(data?.message ?? "Gagal memperbarui postingan. Coba lagi.");
      }
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/40">
        <p className="text-xl font-medium">Postingan tidak ditemukan.</p>
        <Link href="/dashboard/posts" className="btn btn-ghost btn-sm">
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/posts/detail/${id}`}
          className="btn btn-ghost btn-sm btn-circle"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Postingan</h1>
          <p className="text-base-content/50 text-sm">Perbarui konten postingan Anda.</p>
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
                <p className="fieldset-label text-error text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Gambar
              </legend>

              {/* New image preview */}
              {imagePreview ? (
                <div className="relative w-full rounded-box overflow-hidden border border-base-300 mb-2">
                  <Image
                    src={imagePreview}
                    alt="Pratinjau gambar baru"
                    width={800}
                    height={400}
                    className="w-full object-cover max-h-64"
                  />
                  <button
                    type="button"
                    onClick={removeNewImage}
                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                    aria-label="Hapus gambar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 badge badge-primary badge-sm">
                    Gambar baru
                  </span>
                </div>
              ) : currentImage ? (
                <div className="relative w-full rounded-box overflow-hidden border border-base-300 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImage}
                    alt="Gambar saat ini"
                    className="w-full object-cover max-h-64"
                  />
                  <span className="absolute bottom-2 left-2 badge badge-ghost badge-sm">
                    Gambar saat ini
                  </span>
                </div>
              ) : null}

              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-base-300 rounded-box p-6 cursor-pointer hover:border-primary transition-colors">
                <ImageIcon className="w-6 h-6 text-base-content/30" />
                <span className="text-sm text-base-content/50">
                  {currentImage || imagePreview ? "Ganti gambar" : "Unggah gambar"}
                </span>
                <span className="text-xs text-base-content/30">JPG, PNG, WebP — maks. 1MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {errors.image && (
                <p className="fieldset-label text-error text-xs mt-1">
                  {errors.image.message as string}
                </p>
              )}
            </fieldset>

            <div className="flex gap-3 justify-end">
              <Link
                href={`/dashboard/posts/detail/${id}`}
                className="btn btn-ghost"
              >
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
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
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
