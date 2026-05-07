"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import type { Post } from "@/types/post";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Pencil, Trash2, Calendar, User } from "lucide-react";
import { useSession } from "next-auth/react";
export default function DashboardPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/40">
        <p className="text-xl font-medium">Postingan tidak ditemukan.</p>
        <Link href="/dashboard/posts" className="btn btn-ghost btn-sm">
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  const isOwner = session?.user?.id === String((post.author ?? post.user)?.id);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/posts" className="btn btn-ghost btn-sm btn-circle">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold">Detail Postingan</h1>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Link
              href={`/dashboard/posts/update/${post.id}`}
              className="btn btn-info btn-sm gap-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              className="btn btn-error btn-sm gap-1"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        )}
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm max-w-3xl">
        <div className="card-body gap-5">
          <h2 className="text-2xl font-bold leading-snug">{post.title}</h2>

          <div className="flex items-center gap-5 text-sm text-base-content/50 border-b border-base-200 pb-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {(post.author ?? post.user)?.name ?? "-"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
          </div>

          {post.image_url && (
            <div className="relative w-full aspect-video rounded-box overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-base max-w-none text-base-content/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      {/* Delete Modal */}
      {deleteOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg">Hapus Postingan</h3>
            <p className="py-4 text-base-content/70">
              Yakin ingin menghapus &quot;{post.title}&quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Batal
              </button>
              <button className="btn btn-error" onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className="loading loading-spinner loading-sm" /> : "Hapus"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteOpen(false)} />
        </dialog>
      )}
    </>
  );
}
