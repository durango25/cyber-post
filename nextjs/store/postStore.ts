import { create } from "zustand";
import type { Post, SortConfig, PostFilter } from "@/types/post";

interface PostStore {
  posts: Post[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  sort: SortConfig;
  filter: PostFilter;
  setPosts: (posts: Post[], total: number, totalPages: number) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: SortConfig) => void;
  setFilter: (filter: PostFilter) => void;
  reset: () => void;
}

const defaultSort: SortConfig = { column: "created_at", type: "desc" };
const defaultFilter: PostFilter = { quick: [], items: [] };

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  total: 0,
  totalPages: 1,
  page: 1,
  limit: 10,
  sort: defaultSort,
  filter: defaultFilter,
  setPosts: (posts, total, totalPages) => set({ posts, total, totalPages }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setFilter: (filter) => set({ filter, page: 1 }),
  reset: () =>
    set({
      posts: [],
      total: 0,
      totalPages: 1,
      page: 1,
      sort: defaultSort,
      filter: defaultFilter,
    }),
}));
