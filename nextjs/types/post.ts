export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  image_url: string | null;
  user_id?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PostPayload {
  title: string;
  content: string;
  image?: File | null;
  image_url?: string | null;
}

export interface PaginatedPosts {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface PublicPostsResponse {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export type SortType = "asc" | "desc";

export interface SortConfig {
  column: string;
  type: SortType;
}

export interface FilterItem {
  column: string;
  operator: string;
  value: string;
}

export interface PostFilter {
  quick?: string[];
  items?: FilterItem[];
}
