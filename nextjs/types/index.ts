export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  image_url: string | null;
  user_id: number;
  author: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedPosts {
  data: Post[];
  meta: PaginationMeta;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface PostFilters {
  search?: string;
  title?: string;
  content?: string;
  page?: number;
}
