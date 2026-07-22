import api from "./axios";

/**
 * Site copy that used to be hardcoded in the components.
 *
 * `items` are the repeatable lists keyed by section (HOME_FAQ, ABOUT_VALUE …);
 * `text` are one-off strings keyed by name (home.hero.subtitle …).
 */
export type ContentItem = {
  id: number;
  section: string;
  title: string | null;
  body: string | null;
  /** Lucide icon name — resolve through lib/contentIcons, never dynamically. */
  icon: string | null;
  link: string | null;
  extra: string | null;
  sortOrder: number;
  active: boolean;
};

export type SiteContent = {
  items: Record<string, ContentItem[]>;
  text: Record<string, string>;
};

export type SiteTextRow = {
  id: number;
  contentKey: string;
  value: string | null;
  description: string | null;
};

/** One request for every marketing page's copy. Public — no account needed. */
export async function fetchSiteContent(): Promise<SiteContent> {
  const { data } = await api.get<SiteContent>("/content");
  return { items: data.items ?? {}, text: data.text ?? {} };
}

/* ───────────────────────────────── admin ───────────────────────────────── */

/** Admin listing — includes rows switched off, which the public feed omits. */
export async function fetchAllContentItems(section?: string): Promise<ContentItem[]> {
  const { data } = await api.get<ContentItem[]>("/content/admin/items", {
    params: section ? { section } : undefined,
  });
  return data;
}

export async function fetchContentSections(): Promise<string[]> {
  const { data } = await api.get<string[]>("/content/admin/sections");
  return data;
}

export async function createContentItem(item: Partial<ContentItem>): Promise<ContentItem> {
  const { data } = await api.post<ContentItem>("/content/admin/items", item);
  return data;
}

export async function updateContentItem(id: number, item: Partial<ContentItem>): Promise<ContentItem> {
  const { data } = await api.put<ContentItem>(`/content/admin/items/${id}`, item);
  return data;
}

export async function deleteContentItem(id: number): Promise<void> {
  await api.delete(`/content/admin/items/${id}`);
}

export async function fetchSiteTextRows(): Promise<SiteTextRow[]> {
  const { data } = await api.get<SiteTextRow[]>("/content/admin/text");
  return data;
}

/** Only the value is editable — keys are what the components look up by name. */
export async function updateSiteText(key: string, value: string): Promise<SiteTextRow> {
  const { data } = await api.put<SiteTextRow>(`/content/admin/text/${key}`, { value });
  return data;
}
