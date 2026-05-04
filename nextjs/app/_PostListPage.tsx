"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePostStore } from "@/store/postStore";
import { Navbar } from "@/components/Navbar";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Post } from "@/types";

export default function PostListPage() {
  const { data: session } = useSession();
  const { posts, meta, filters, loading, setFilters, fetchPosts, deletePost } = usePostStore();

  const load = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    load();
  }, [load, filters]);

  const handleSearch = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleDelete = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    await deletePost(post.id);
    fetchPosts();
  };

  const handlePage = (page: number) => {
    setFilters({ page });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Link href="/posts/new" className="btn btn-primary gap-2">
            <Plus size={18} /> New Post
          </Link>
        </div>

        {/* Search */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search posts…"
            className="input input-bordered w-full max-w-sm"
            defaultValue={filters.search ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="card bg-base-100 shadow">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <Loader2 size={24} className="animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 opacity-60">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td className="font-mono text-sm opacity-60">{post.id}</td>
                      <td>
                        <Link href={`/posts/${post.id}`} className="link link-hover font-medium">
                          {post.title}
                        </Link>
                      </td>
                      <td className="opacity-70">{post.author.name}</td>
                      <td className="text-sm opacity-60">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex gap-1 justify-end">
                          <Link
                            href={`/posts/${post.id}`}
                            className="btn btn-ghost btn-xs"
                          >
                            View
                          </Link>
                          {session?.user?.id === String(post.user_id) && (
                            <>
                              <Link
                                href={`/posts/${post.id}/edit`}
                                className="btn btn-ghost btn-xs"
                              >
                                <Pencil size={14} />
                              </Link>
                              <button
                                className="btn btn-ghost btn-xs text-error"
                                onClick={() => handleDelete(post)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center mt-6">
            <div className="join">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`join-item btn btn-sm ${page === meta.current_page ? "btn-active" : ""}`}
                  onClick={() => handlePage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
