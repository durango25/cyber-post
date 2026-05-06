"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import type { Post } from "@/types";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";

// const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get<{ data: Post }>(`/posts/${id}`)
      .then((res) => setPost(res.data.data))
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      router.push("/");
    } catch {
      setDeleting(false);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const isOwner = session?.user?.id === String(post.user_id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="card bg-base-100 shadow">
        {/* Cover image */}
        {post.image_url && (
          <figure className="relative w-full h-56 overflow-hidden rounded-t-2xl">
            <Image
              // src={`${STORAGE_URL}/storage/${post.image}`}
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </figure>
        )}

        <div className="card-body gap-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm opacity-60">
            <span>By {post.author.name}</span>
            <span>·</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <div className="divider my-1" />
          <div
            className="prose prose-sm max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {isOwner && (
            <div className="flex gap-2 justify-end pt-2">
              <Link href={`/posts/${post.id}/edit`} className="btn btn-sm btn-outline gap-1">
                <Pencil size={14} /> Edit
              </Link>
              <button
                className="btn btn-sm btn-error gap-1"
                onClick={() => setShowModal(true)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Post</h3>
            <p className="py-4">
              Are you sure you want to delete &ldquo;{post.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-error gap-1" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
        </dialog>
      )}
    </div>
  );
}
