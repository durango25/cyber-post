import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDate, stripHtml } from "@/lib/utils";
import type { Post } from "@/types/post";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { siteConfig } from "@/config/site";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/public/posts/${slug}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Postingan Tidak Ditemukan | " + siteConfig.short_name };
  return {
    title: `${post.title} | ${siteConfig.short_name}`,
    description: stripHtml(post.content).slice(0, 160),
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/posts" className="btn btn-ghost btn-sm gap-1 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar
      </Link>

      <article className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

        <div className="flex items-center gap-5 text-sm text-base-content/50 border-b border-base-200 pb-6">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {(post.author ?? post.user)?.name ?? "Anonim"}
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
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-base max-w-none text-base-content/80"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}

