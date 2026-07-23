import api from "./axios";

/**
 * The community blog client.
 *
 * Three audiences, three groups of calls: anyone can read published posts and
 * the topic list; a signed-in author manages their own posts under `/blog/me`;
 * an admin moderates under `/blog/admin`. The server owns status and ownership,
 * so nothing here can publish a post or touch someone else's — those requests
 * simply come back 403/404.
 */

export type PostStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";

export type BlogTopic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  postCount: number;
};

/** A post as it appears in a listing — no body. */
export type BlogPostCard = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  topicName: string | null;
  topicSlug: string | null;
  authorName: string | null;
  readMinutes: number;
  publishedAt: string | null;
};

/** A post in full — the detail view and the author/admin editors. */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  topicId: string | null;
  topicName: string | null;
  topicSlug: string | null;
  authorName: string | null;
  status: PostStatus;
  rejectionReason: string | null;
  readMinutes: number;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

/** Spring Data page envelope, only the fields the UI reads. */
export type Page<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type BlogPostInput = {
  title: string;
  topicId: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string | null;
};

/** Thrown when a slug matches no published post, so callers can show a real 404. */
export class BlogPostNotFound extends Error {}

/* ─────────────────────────────── public ─────────────────────────────── */

export async function fetchBlogTopics(): Promise<BlogTopic[]> {
  const { data } = await api.get<BlogTopic[]>("/blog/topics");
  return data;
}

export async function fetchBlogPosts(
  opts: { topic?: string; page?: number; size?: number } = {},
): Promise<Page<BlogPostCard>> {
  const { data } = await api.get<Page<BlogPostCard>>("/blog/posts", {
    params: {
      topic: opts.topic || undefined,
      page: opts.page ?? 0,
      size: opts.size ?? 12,
    },
  });
  return data;
}

export async function fetchBlogPost(slug: string): Promise<BlogPost> {
  try {
    const { data } = await api.get<BlogPost>(`/blog/posts/${slug}`);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) throw new BlogPostNotFound(slug);
    throw e;
  }
}

/* ─────────────────────────────── author ─────────────────────────────── */

export async function fetchMyPosts(): Promise<BlogPost[]> {
  const { data } = await api.get<BlogPost[]>("/blog/me/posts");
  return data;
}

export async function fetchMyPost(id: string): Promise<BlogPost> {
  const { data } = await api.get<BlogPost>(`/blog/me/posts/${id}`);
  return data;
}

export async function createMyPost(input: BlogPostInput): Promise<BlogPost> {
  const { data } = await api.post<BlogPost>("/blog/me/posts", input);
  return data;
}

export async function updateMyPost(id: string, input: BlogPostInput): Promise<BlogPost> {
  const { data } = await api.put<BlogPost>(`/blog/me/posts/${id}`, input);
  return data;
}

export async function submitMyPost(id: string): Promise<BlogPost> {
  const { data } = await api.post<BlogPost>(`/blog/me/posts/${id}/submit`);
  return data;
}

export async function deleteMyPost(id: string): Promise<void> {
  await api.delete(`/blog/me/posts/${id}`);
}

export async function uploadMyPostCover(id: string, file: File): Promise<BlogPost> {
  const fd = new FormData();
  fd.append("image", file);
  const { data } = await api.post<BlogPost>(`/blog/me/posts/${id}/cover`, fd);
  return data;
}

/** Upload an image for use inside the post body; returns its hosted URL. */
export async function uploadInlineImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const { data } = await api.post<{ url: string }>("/blog/me/images", fd);
  return data.url;
}

/* ─────────────────────────────── admin ──────────────────────────────── */

export async function fetchAdminTopics(): Promise<BlogTopic[]> {
  const { data } = await api.get<BlogTopic[]>("/blog/admin/topics");
  return data;
}

export async function createTopic(input: Partial<BlogTopic>): Promise<BlogTopic> {
  const { data } = await api.post<BlogTopic>("/blog/admin/topics", input);
  return data;
}

export async function updateTopic(id: string, input: Partial<BlogTopic>): Promise<BlogTopic> {
  const { data } = await api.put<BlogTopic>(`/blog/admin/topics/${id}`, input);
  return data;
}

export async function deleteTopic(id: string): Promise<void> {
  await api.delete(`/blog/admin/topics/${id}`);
}

export async function fetchAdminPosts(
  status: PostStatus,
  page = 0,
  size = 20,
): Promise<Page<BlogPost>> {
  const { data } = await api.get<Page<BlogPost>>("/blog/admin/posts", {
    params: { status, page, size },
  });
  return data;
}

export async function approvePost(id: string): Promise<BlogPost> {
  const { data } = await api.post<BlogPost>(`/blog/admin/posts/${id}/approve`);
  return data;
}

export async function rejectPost(id: string, reason: string): Promise<BlogPost> {
  const { data } = await api.post<BlogPost>(`/blog/admin/posts/${id}/reject`, { reason });
  return data;
}

/** Admin take-down — removes a post of any status, published included. */
export async function adminDeletePost(id: string): Promise<void> {
  await api.delete(`/blog/admin/posts/${id}`);
}
