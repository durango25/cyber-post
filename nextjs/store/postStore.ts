import { create } from "zustand";
import api from "@/lib/api";
import type { Post, PaginatedPosts, PostFilters } from "@/types";

interface PostState {
  posts: Post[];
  meta: PaginatedPosts["meta"] | null;
  filters: PostFilters;
  loading: boolean;
  error: string | null;

  setFilters: (filters: Partial<PostFilters>) => void;
  fetchPosts: () => Promise<void>;
  createPost: (data: FormData) => Promise<Post>;
  updatePost: (id: number, data: FormData) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  meta: null,
  filters: { page: 1 },
  loading: false,
  error: null,

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params: Record<string, string | number> = {};
      if (filters.page) params.page = filters.page;
      if (filters.search) params.search = filters.search;
      if (filters.title) params.title = filters.title;
      if (filters.content) params.content = filters.content;

      const res = await api.get<PaginatedPosts>("/posts", { params });
      set({ posts: res.data.data, meta: res.data.meta, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch posts";
      set({ error: msg, loading: false });
    }
  },

  createPost: async (data) => {
    const res = await api.post<{ data: Post }>("/posts", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  updatePost: async (id, data) => {
    // Laravel requires _method=PUT for multipart form data
    data.append("_method", "PUT");
    const res = await api.post<{ data: Post }>(`/posts/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  deletePost: async (id) => {
    await api.delete(`/posts/${id}`);
  },
}));
