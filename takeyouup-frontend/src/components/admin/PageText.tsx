import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { ListSkeleton } from "@/components/Skeletons";
import StateMessage from "@/components/StateMessage";
import { fetchSiteTextRows, updateSiteText, type SiteTextRow } from "@/api/content";

/**
 * "Page Text" — the one-off strings (a headline, the paragraph under it) that
 * are not part of any repeatable list.
 *
 * Only the value is editable. The backend exposes exactly one write — set the
 * value for a key — so there is deliberately no create, delete or rename here:
 * a key exists because a component looks it up by name, and inventing one from
 * the admin would produce a row nothing reads.
 */

const inp = "w-full rounded-lg border px-3 py-2 text-sm bg-transparent";

const errText = (e: any, fallback: string) =>
  e?.response?.data?.message || e?.message || fallback;

export default function PageText() {
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<SiteTextRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchSiteTextRows()
      .then((data) => {
        if (!alive) return;
        const list = data ?? [];
        setRows(list);
        setDrafts(Object.fromEntries(list.map((r) => [r.contentKey, r.value ?? ""])));
        setError(null);
      })
      .catch((e: any) => {
        if (!alive) return;
        setRows([]);
        setDrafts({});
        setError(errText(e, "The server did not respond."));
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [reload]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.contentKey, r.description, r.value]
        .some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [rows, search]);

  const save = async (row: SiteTextRow) => {
    const value = drafts[row.contentKey] ?? "";
    setSavingKey(row.contentKey);
    try {
      const updated = await updateSiteText(row.contentKey, value);
      const saved = updated?.value ?? value;
      setRows((rs) => rs.map((r) => (r.contentKey === row.contentKey ? { ...r, value: saved } : r)));
      setDrafts((d) => ({ ...d, [row.contentKey]: saved }));
      toast.success("Copy updated");
      // The public pages read this copy from the cached ["siteContent"] query.
      queryClient.invalidateQueries({ queryKey: ["siteContent"] });
    } catch (e: any) {
      toast.error(errText(e, "Save failed"));
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Page Text</h1>
        <p className="text-sm opacity-60 mt-1">
          One-off copy used across the marketing pages. Edit a value and save it — the
          key itself is fixed, because a component looks the copy up by that name.
        </p>
      </div>

      {!loading && !error && rows.length > 0 && (
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          <input className={`${inp} pl-9`} placeholder="Search keys or copy…"
            aria-label="Search page text" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {loading && <ListSkeleton count={5} height={150} />}

      {!loading && error && (
        <StateMessage
          tone="error"
          title="Couldn't load the page text"
          description={`${error} — the copy is still there, the list just failed to load.`}
          onRetry={() => setReload((n) => n + 1)}
          retryLabel="Retry"
        />
      )}

      {!loading && !error && rows.length === 0 && (
        <StateMessage
          title="No page text yet"
          description="Nothing has been registered for editing. Keys appear here once the site defines them."
        />
      )}

      {!loading && !error && rows.length > 0 && visible.length === 0 && (
        <StateMessage
          title="Nothing matches that search"
          description="Try a shorter term, or part of the key such as “home”."
        />
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="space-y-3">
          {visible.map((row) => {
            const draft = drafts[row.contentKey] ?? "";
            const dirty = draft !== (row.value ?? "");
            const saving = savingKey === row.contentKey;
            const fieldId = `site-text-${row.contentKey}`;
            return (
              <div key={row.contentKey} className="rounded-2xl border p-4">
                <label htmlFor={fieldId} className="block text-sm font-semibold">
                  {row.description || row.contentKey}
                </label>
                <p className="mt-0.5 font-mono text-[11px] opacity-50 break-all">{row.contentKey}</p>
                <textarea id={fieldId} className={`${inp} mt-2`} rows={3} value={draft}
                  onChange={(e) => setDrafts((d) => ({ ...d, [row.contentKey]: e.target.value }))} />
                <div className="mt-2 flex items-center justify-end gap-3">
                  {dirty && <span className="text-[11px] opacity-55">Unsaved changes</span>}
                  <button
                    className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
                    disabled={!dirty || saving}
                    onClick={() => save(row)}>
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
