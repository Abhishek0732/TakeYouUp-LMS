import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "TakeYouUp";
const SUFFIX = `${SITE} - Master Programming & Build Your Future`;

/**
 * Per-page SEO metadata for a client-rendered app.
 *
 * Every route previously shared the single <meta name="description"> baked into
 * index.html — 13 URLs, one description — and none had a canonical URL. Search
 * engines fall back to inventing their own snippet in that situation, and with
 * course slugs living at the root (`/:courseSlug`) there was nothing telling
 * them which URL is authoritative.
 *
 * The canonical is derived from the live origin rather than a hardcoded domain,
 * so it stays correct on whatever host the app is served from — the same
 * reasoning as the relative API base URL.
 *
 * `noindex` is for pages that exist for a signed-in user but would be thin,
 * duplicated or private in an index (the 404 page, auth screens).
 */
export type SeoOptions = {
  /** Page title WITHOUT the site suffix — pass the bare page name. */
  title: string;
  description?: string;
  /** Keep this page out of search results. */
  noindex?: boolean;
  /** Overrides the derived canonical; use for paginated or filtered views. */
  canonicalPath?: string;
};

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function useSeo({ title, description, noindex, canonicalPath }: SeoOptions) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SUFFIX}` : SUFFIX;
    document.title = fullTitle;

    if (description) {
      upsertMeta('meta[name="description"]', "name", "description", description);
      upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    }

    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);

    const url = `${window.location.origin}${canonicalPath ?? pathname}`;
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;

    // Only emit a robots tag when we mean to exclude — an absent tag already
    // means "index, follow", and stating it adds nothing.
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      upsertMeta('meta[name="robots"]', "name", "robots", "noindex, follow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, noindex, canonicalPath, pathname]);
}

export default useSeo;
