import { useQuery } from "@tanstack/react-query";
import { fetchSiteContent, type ContentItem } from "@/api/content";

/**
 * Admin-editable copy for the marketing pages.
 *
 * One react-query key for the whole site, so the several components that need
 * copy on a single page share a single request rather than each firing their
 * own. The data changes rarely, hence the long stale time.
 *
 * Both accessors degrade quietly if the request fails, because copy is not
 * worth breaking a page over:
 *   - `items(section)` returns [] — the section renders nothing.
 *   - `text(key, fallback)` returns the fallback the caller passed, which is
 *     the string that used to be hardcoded there. That keeps headlines and
 *     intros — the parts a blank would look broken — readable even offline.
 */
export function useSiteContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["siteContent"],
    queryFn: fetchSiteContent,
    staleTime: 5 * 60_000,
  });

  const items = (section: string): ContentItem[] => data?.items?.[section] ?? [];

  const text = (key: string, fallback = ""): string => {
    const value = data?.text?.[key];
    return value == null || value === "" ? fallback : value;
  };

  return { items, text, loading: isLoading, loaded: !!data };
}

export default useSiteContent;
