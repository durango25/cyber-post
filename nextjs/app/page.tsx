import Link from "next/link";
import Image from "next/image";
// Types
import type { Post } from "@/types/post";
// Utils
import { formatDate, truncate, stripHtml } from "@/lib/utils";
import { siteConfig } from "@/config/site";
// Icons
import { BookOpen, ArrowRight, Calendar, User } from "lucide-react";
import DebugResponse from "@/components/DebugResponse";

async function getPublicPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/public/post-highlight?limit=6`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPublicPosts();

  return (
    <>
      <div className="flex flex-col gap-16">
        {/* Hero */}
        <section className="hero min-h-[40vh] bg-base-200">
          <div className="hero-content text-center py-20">
            <div className="max-w-2xl">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-5xl font-bold mb-4">{siteConfig.short_name}</h1>
              <p className="text-lg text-base-content/70 mb-8">
                Temukan cerita, wawasan, dan ide dari komunitas penulis kami.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link href="/auth/register" className="btn btn-primary">
                  Mulai Menulis
                </Link>
                <a href="#posts" className="btn btn-outline">
                  Jelajahi Artikel
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section id="posts" className="container mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Postingan Terbaru</h2>
            <Link href="/posts" className="btn btn-md gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
              <BookOpen className="w-16 h-16" />
              <p className="text-xl font-medium">Belum ada postingan.</p>
              <p className="text-sm">Jadilah yang pertama menulis!</p>
              <Link href="/auth/register" className="btn btn-primary btn-sm mt-2">
                Mulai Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
          <DebugResponse data={posts} title="Latest Post" buttonTitle="Latest Post" />
        </div>
      )}
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative w-full aspect-video rounded-t-box overflow-hidden bg-base-200">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="eager"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-base-content/20">
            <BookOpen className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="card-body gap-3 flex-1">
        <h3 className="card-title text-lg leading-snug line-clamp-2">
          {post.title}
        </h3>
        <p className="text-base-content/60 text-sm leading-relaxed flex-1">
          {truncate(stripHtml(post.content), 120)}
        </p>

        <div className="flex items-center gap-4 text-xs text-base-content/50 mt-1">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {(post.author ?? post.user)?.name ?? "Anonim"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.created_at)}
          </span>
        </div>

        <div className="card-actions justify-end">
          <Link
            href={`/posts/${post.slug}`}
            className="btn btn-primary btn-sm gap-1"
          >
            Baca <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

