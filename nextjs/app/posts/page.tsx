import Link from "next/link";
import Image from "next/image";
import { formatDate, truncate, stripHtml } from "@/lib/utils";
import type { Post } from "@/types/post";
import { BookOpen, ArrowRight, Calendar, User, Search } from "lucide-react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import DebugResponse from "@/components/DebugResponse";

export const metadata: Metadata = {
  title: "Semua Postingan | " + siteConfig.short_name,
  description: "Jelajahi semua artikel dan tulisan dari komunitas " + siteConfig.short_name + ".",
};

const POSTS_PER_PAGE = 9;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getPublicPosts(page: number, search: string): Promise<{
  posts: Post[];
  total: number;
  totalPages: number;
}> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(POSTS_PER_PAGE),
    });
    if (search.trim()) params.set("search", search.trim());

    const res = await fetch(
      `${API_URL}/api/public/posts?${params}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return { posts: [], total: 0, totalPages: 1 };
    const json = await res.json();
    const total: number = json.data?.total ?? 0;
    return {
      posts: json.data?.data ?? [],
      total,
      totalPages: Math.ceil(total / POSTS_PER_PAGE) || 1,
    };
  } catch {
    return { posts: [], total: 0, totalPages: 1 };
  }
}

/** Returns page numbers to render, using -1 as ellipsis sentinel */
function getPaginationRange(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 1;
  const range: number[] = [];
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  const pages: number[] = [1];
  if (range[0] > 2) pages.push(-1);
  pages.push(...range);
  if (range[range.length - 1] < total - 1) pages.push(-1);
  pages.push(total);
  return pages;
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const currentPage = Math.max(1, Number(sp.page ?? 1));
  const search = sp.search ?? "";

  const { posts, total, totalPages } = await getPublicPosts(currentPage, search);

  const from = total === 0 ? 0 : (currentPage - 1) * POSTS_PER_PAGE + 1;
  const to = Math.min(currentPage * POSTS_PER_PAGE, total);
  const paginationRange = getPaginationRange(currentPage, totalPages);

  function pageHref(p: number) {
    const qs = new URLSearchParams();
    qs.set("page", String(p));
    if (search) qs.set("search", search);
    return `/posts?${qs}`;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Semua Postingan</h1>
          <p className="text-base-content/60">
            {total > 0 ? `${total} artikel tersedia` : "Belum ada artikel."}
          </p>
        </div>

        {/* Search */}
        <form method="GET" action="/posts" className="flex gap-2 max-w-lg">
          <label className="input input-bordered flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-base-content/40" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Cari artikel..."
              className="grow"
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Cari
          </button>
          {search && (
            <Link href="/posts" className="btn btn-ghost">
              Reset
            </Link>
          )}
        </form>

        {search && (
          <p className="text-sm text-base-content/50">
            Hasil pencarian untuk: <span className="font-semibold text-base-content">&quot;{search}&quot;</span>
          </p>
        )}

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
            <BookOpen className="w-16 h-16" />
            <p className="text-xl font-medium">
              {search ? "Artikel tidak ditemukan." : "Belum ada postingan."}
            </p>
            {search ? (
              <Link href="/posts" className="btn btn-ghost btn-sm">
                Lihat semua artikel
              </Link>
            ) : (
              <Link href="/auth/register" className="btn btn-primary btn-sm mt-2">
                Mulai Menulis
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination + entry info */}
        {/* {total > 0 && ( */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <p className="text-sm text-base-content/50">
            Menampilkan {from}-{to} dari {total} entri
          </p>

          {/* {totalPages > 1 && ( */}
          <div className="join">
            <Link
              href={pageHref(currentPage - 1)}
              aria-disabled={currentPage <= 1}
              className={`join-item btn btn-sm ${currentPage <= 1 ? "btn-disabled" : ""}`}
            >
              «
            </Link>

            {paginationRange.map((p, idx) =>
              p === -1 ? (
                <span key={`ellipsis-${idx}`} className="join-item btn btn-sm btn-disabled">
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className={`join-item btn btn-sm ${p === currentPage ? "btn-active" : ""}`}
                >
                  {p}
                </Link>
              )
            )}

            <Link
              href={pageHref(currentPage + 1)}
              aria-disabled={currentPage >= totalPages}
              className={`join-item btn btn-sm ${currentPage >= totalPages ? "btn-disabled" : ""}`}
            >
              »
            </Link>
          </div>
          {/* )} */}
        </div>
        {/* )} */}
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
          <DebugResponse data={{ posts, total, totalPages, currentPage, search }} title="Posts Data" buttonTitle="Posts Data" />
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
        <h3 className="card-title text-lg leading-snug line-clamp-2">{post.title}</h3>
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

