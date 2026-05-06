"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { usePostStore } from "@/store/postStore";
import { PostForm } from "@/components/PostForm";
import type { Post } from "@/types";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const { updatePost } = usePostStore();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [rootError, setRootError] = useState<string | undefined>();

  useEffect(() => {
    api.get<{ data: Post }>(`/posts/${id}`)
      .then((res) => {
        const p = res.data.data;
        if (session?.user?.id && session.user.id !== String(p.user_id)) {
          router.push(`/posts/${id}`);
          return;
        }
        setPost(p);
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [id, session, router]);

  const handleSubmit = async (formData: FormData) => {
    setRootError(undefined);
    try {
      const updated = await updatePost(Number(id), formData);
      router.push(`/posts/${updated.id}`);
    } catch {
      setRootError("Failed to update post. Please try again.");
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

  const currentImageUrl = post.image_url
    ? post.image_url
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/posts/${id}`} className="btn btn-ghost btn-sm gap-1">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body gap-4">
          <h1 className="card-title text-2xl">Edit Post</h1>
          <PostForm
            defaultValues={{ title: post.title, content: post.content }}
            currentImageUrl={currentImageUrl}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            rootError={rootError}
          />
        </div>
      </div>
    </div>
  );
}
