"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePostStore } from "@/store/postStore";
import { PostForm } from "@/components/PostForm";
import { ArrowLeft } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const { createPost } = usePostStore();
  const [rootError, setRootError] = useState<string | undefined>();

  const handleSubmit = async (formData: FormData) => {
    setRootError(undefined);
    try {
      const post = await createPost(formData);
      router.push(`/posts/${post.id}`);
    } catch {
      setRootError("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body gap-4">
          <h1 className="card-title text-2xl">New Post</h1>
          <PostForm
            onSubmit={handleSubmit}
            submitLabel="Create Post"
            rootError={rootError}
          />
        </div>
      </div>
    </div>
  );
}

