"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePostStore } from "@/store/postStore";
import api from "@/lib/api";
import type { Post } from "@/types/post";
import { formatDate, stripHtml, truncate } from "@/lib/utils";
import {
  PlusCircle,
  Trash2,
  Pencil,
  Eye,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  RefreshCw,
} from "lucide-react";
import DebugResponse from "@/components/DebugResponse";

function SortIcon({ active, type }: { active: boolean; type: "asc" | "desc" }) {
  if (!active) return <ChevronUp className="w-3 h-3 opacity-30" />;
  return type === "asc" ? (
    <ChevronUp className="w-3 h-3 text-primary" />
  ) : (
    <ChevronDown className="w-3 h-3 text-primary" />
  );
}

export default function DashboardPostsPage() {
  const { data: session } = useSession();
  const {
    posts,
    total,
    totalPages,
    page,
    limit,
    sort,
    filter,
    setPosts,
    setPage,
    setLimit,
    setSort,
    setFilter,
  } = usePostStore();

  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {
          page,
          limit,
          sort: { column: sort.column, type: sort.type },
          filter: {
            quick: filter.quick ?? [],
            items: filter.items ?? [],
          },
        };
        const { data } = await api.get("/posts", { params });
        if (!active) return;
        const list: Post[] = data.data?.data ?? [];
        const totalCount: number = data.data?.total ?? 0;
        const totalPgs = Math.ceil(totalCount / limit) || 1;
        setPosts(list, totalCount, totalPgs);
      } catch {
        // silently fail — will show empty state
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [page, limit, sort, filter, setPosts, refreshKey]);

  const handleSearch = () => {
    const terms = quickSearch.trim().split(/\s+/).filter(Boolean);
    setFilter({ ...filter, quick: terms });
  };

  const clearSearch = () => {
    setQuickSearch("");
    setFilter({ ...filter, quick: [] });
  };

  const toggleSort = (col: string) => {
    if (sort.column === col) {
      setSort({ column: col, type: sort.type === "asc" ? "desc" : "asc" });
    } else {
      setSort({ column: col, type: "asc" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${deleteId}`);
      setDeleteId(null);
      setRefreshKey((k) => k + 1);
    } catch {
      // handle silently
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Post</h1>
          <p className="text-base-content/50 text-sm mt-0.5">
            {total} postingan total
          </p>
        </div>
        <Link href="/dashboard/posts/create" className="btn btn-primary btn-sm gap-1">
          <PlusCircle className="w-4 h-4" />
          Buat Post
        </Link>
      </div>

      {/* Quick search + per-page */}
      <div className="flex flex-wrap gap-2 items-center">
        <label className="input input-bordered input-sm flex items-center gap-2 flex-1 min-w-48 max-w-md">
          <Search className="w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Cari judul atau konten..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="grow"
          />
          {quickSearch && (
            <button onClick={clearSearch} aria-label="Clear search">
              <X className="w-4 h-4 text-base-content/40 hover:text-base-content" />
            </button>
          )}
        </label>
        <button className="btn btn-sm btn-outline" onClick={handleSearch}>
          Cari
        </button>
        <button className="btn btn-sm btn-ghost btn-circle" onClick={() => setRefreshKey((k) => k + 1)} aria-label="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-base-content/50 whitespace-nowrap">Baris per halaman:</span>
          <select
            className="select select-bordered select-sm"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-box border border-base-200">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="w-8">#</th>
              <th>
                <button
                  className="flex items-center gap-1 font-semibold hover:text-primary"
                  onClick={() => toggleSort("title")}
                >
                  Judul <SortIcon active={sort.column === "title"} type={sort.type} />
                </button>
              </th>
              <th className="hidden md:table-cell">Penulis</th>
              <th>
                <button
                  className="flex items-center gap-1 font-semibold hover:text-primary"
                  onClick={() => toggleSort("created_at")}
                >
                  Tanggal <SortIcon active={sort.column === "created_at"} type={sort.type} />
                </button>
              </th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <span className="loading loading-spinner loading-md text-primary" />
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-base-content/40">
                  Tidak ada postingan ditemukan.
                  {(filter.quick?.length ?? 0) > 0 && (
                    <button className="btn btn-xs btn-ghost ml-2" onClick={clearSearch}>
                      Hapus pencarian
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              posts.map((post: Post, idx: number) => (
                <tr key={post.id}>
                  <td className="text-base-content/40 text-sm">
                    {(page - 1) * limit + idx + 1}
                  </td>
                  <td className="max-w-xs">
                    <p className="font-medium line-clamp-1">{post.title}</p>
                    <p className="text-xs text-base-content/40 line-clamp-1 mt-0.5">
                      {truncate(stripHtml(post.content), 60)}...
                    </p>
                  </td>
                  <td className="hidden md:table-cell text-sm text-base-content/60">
                    {(post.author ?? post.user)?.name ?? "-"}
                  </td>
                  <td className="text-sm text-base-content/60 whitespace-nowrap">
                    {formatDate(post.created_at)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/posts/detail/${post.id}`}
                        className="btn btn-ghost btn-xs btn-circle"
                        title="Lihat"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      {session?.user?.id === String((post.author ?? post.user)?.id) && (
                        <>
                          <Link
                            href={`/dashboard/posts/update/${post.id}`}
                            className="btn btn-ghost btn-xs btn-circle text-info"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            className="btn btn-ghost btn-xs btn-circle text-error"
                            title="Hapus"
                            onClick={() => setDeleteId(post.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Table footer */}
        {!loading && posts.length > 0 && (
          <div className="px-4 py-2 border-t border-base-200 bg-base-100 text-sm text-base-content/50">
            {(() => {
              const from = (page - 1) * limit + 1;
              const to = Math.min(page * limit, total);
              return `Menampilkan ${from}-${to} dari ${total} entri`;
            })()}
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && ( */}
      <div className="flex justify-center">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`join-item btn btn-sm ${page === p ? "btn-active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="join-item btn btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            »
          </button>
        </div>
      </div>
      {/* )} */}

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg">Hapus Postingan</h3>
            <p className="py-4 text-base-content/70">
              Yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
        </dialog>
      )}


      {process.env.NODE_ENV === "development" && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
          <DebugResponse data={posts} title="Table Post" buttonTitle="Table Post" />
        </div>
      )}
    </>
  );
}
