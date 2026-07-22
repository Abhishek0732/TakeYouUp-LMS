import React, { useCallback, useEffect, useId, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import DataGrid, { Column } from "@/components/admin/DataGrid";
import { useModalA11y } from "@/components/admin/useModalA11y";
import { CONTENT_ICON_NAMES, contentIcon } from "@/lib/contentIcons";
import {
  createContentItem,
  deleteContentItem,
  fetchAllContentItems,
  fetchContentSections,
  updateContentItem,
  type ContentItem,
} from "@/api/content";

/**
 * "Page Content" — the repeatable lists behind the marketing pages
 * (home features, the steps, the FAQs, the about-page values …).
 *
 * Every row belongs to a `section`, and each section uses a different subset of
 * the same columns — HOME_FAQ has no icon, ABOUT_STORY has no title. Rather
 * than hide fields (a new section would then be uneditable) the form spells out
 * what each field means for the chosen section, and leaves the rest blank.
 */

const inp = "w-full rounded-lg border px-3 py-2 text-sm bg-transparent";
const optStyle = { background: "hsl(var(--card))", color: "hsl(var(--foreground))" };

const errText = (e: any, fallback: string) =>
  e?.response?.data?.message || e?.message || fallback;

/** What each field means per section, so an admin never has to guess. */
type SectionGuide = {
  summary: string;
  title?: string;
  body?: string;
  icon?: string;
  link?: string;
  extra?: string;
};

const UNUSED = "Not used by this section — leave it blank.";

const SECTION_GUIDE: Record<string, SectionGuide> = {
  HOME_FEATURE: {
    summary: "Home page feature card: a title, a short paragraph and an icon.",
    title: "The feature name.",
    body: "One or two sentences describing it.",
    icon: "Shown above the title.",
  },
  ABOUT_VALUE: {
    summary: "About page value card: a title, a short paragraph and an icon.",
    title: "The value's name.",
    body: "One or two sentences describing it.",
    icon: "Shown above the title.",
  },
  HOME_STEP: {
    summary: "A step in the home page \"how it works\" list: title, paragraph, icon and the step number.",
    title: "What happens in this step.",
    body: "One or two sentences describing it.",
    icon: "Shown with the step.",
    extra: "The displayed step number, e.g. \"01\".",
  },
  HOME_FAQ: {
    summary: "Home page FAQ: the title is the question, the body is the answer.",
    title: "The question.",
    body: "The answer, as one or more sentences.",
    icon: UNUSED,
  },
  CONTACT_FAQ: {
    summary: "Contact page FAQ: the title is the question, the body is the answer.",
    title: "The question.",
    body: "The answer, as one or more sentences.",
    icon: UNUSED,
  },
  ABOUT_REASON: {
    summary: "A single bullet line on the about page — title only.",
    title: "The bullet text.",
    body: UNUSED,
    icon: UNUSED,
  },
  ABOUT_STORY: {
    summary: "The about page story — one paragraph per row, body only.",
    title: UNUSED,
    body: "One paragraph of the story.",
    icon: UNUSED,
  },
  CONTACT_INFO: {
    summary: "A contact detail: a label, the value people read, and where it links.",
    title: "The label, e.g. \"Email\".",
    body: "The visible value, e.g. \"hello@takeyouup.com\".",
    link: "The href it opens, e.g. \"mailto:hello@takeyouup.com\". May be blank.",
    icon: "Shown next to the label.",
  },
};

const FALLBACK_GUIDE: SectionGuide = {
  summary: "A new section. Fill in only the fields the page that reads it needs.",
};

const guideFor = (section: string): SectionGuide =>
  SECTION_GUIDE[section.trim().toUpperCase()] ?? FALLBACK_GUIDE;

// ------------------------------------------------------------------ cells
const Truncated = ({ text, width }: { text?: string | null; width: string }) =>
  text ? (
    <span className={`block ${width} truncate`} title={text}>{text}</span>
  ) : (
    <span className="opacity-40">—</span>
  );

const ActiveBadge = ({ on }: { on: boolean }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
    style={{
      background: on ? "rgba(34,197,94,0.15)" : "rgba(148,163,184,0.15)",
      color: on ? "#22c55e" : "#94a3b8",
    }}>
    {on ? "Live" : "Hidden"}
  </span>
);

// ------------------------------------------------------------------ screen
export default function PageContent() {
  const queryClient = useQueryClient();
  const [sections, setSections] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<{ section?: string }>({});
  const [reload, setReload] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);

  // A failed section list is not worth a blocking error: the filter simply
  // offers nothing and the form still accepts a typed section name.
  useEffect(() => {
    let alive = true;
    fetchContentSections()
      .then((s) => { if (alive) setSections(s ?? []); })
      .catch(() => { if (alive) setSections([]); });
    return () => { alive = false; };
  }, [reload]);

  /** Reload the grid AND drop the public site's cached copy. */
  const refresh = useCallback(() => {
    setReload((n) => n + 1);
    queryClient.invalidateQueries({ queryKey: ["siteContent"] });
  }, [queryClient]);

  const fetchPage = useCallback(async ({ page, size, search, filters }: any) => {
    const all = await fetchAllContentItems(filters?.section || undefined);
    const q = (search || "").trim().toLowerCase();
    const matched = q
      ? all.filter((r) =>
          [r.section, r.title, r.body, r.icon, r.link, r.extra]
            .some((v) => String(v ?? "").toLowerCase().includes(q)))
      : all;
    const sorted = [...matched].sort(
      (a, b) => a.section.localeCompare(b.section) || a.sortOrder - b.sortOrder);
    return { rows: sorted.slice(page * size, page * size + size), total: sorted.length };
  }, []);

  const save = async (payload: Partial<ContentItem>) => {
    try {
      if (editing) await updateContentItem(editing.id, payload);
      else await createContentItem(payload);
      toast.success(editing ? "Content updated" : "Content created");
      refresh();
    } catch (e: any) {
      toast.error(errText(e, "Save failed"));
      throw e;
    }
  };

  const remove = async (row: ContentItem) => {
    try {
      await deleteContentItem(row.id);
      toast.success("Content deleted");
      refresh();
    } catch (e: any) {
      toast.error(errText(e, "Delete failed"));
    }
  };

  const removeMany = async (rows: ContentItem[]) => {
    let ok = 0;
    let firstError = "";
    for (const r of rows) {
      try { await deleteContentItem(r.id); ok++; }
      catch (e: any) { if (!firstError) firstError = errText(e, "Delete failed"); }
    }
    if (ok === rows.length) toast.success(`Deleted ${ok}/${rows.length}`);
    else toast.error(`Deleted ${ok}/${rows.length} — ${firstError}`);
    refresh();
  };

  const columns: Column[] = [
    {
      key: "section", label: "Section", width: "190px",
      render: (r) => <span className="font-mono text-xs opacity-80">{r.section}</span>,
    },
    { key: "title", label: "Title", render: (r) => <Truncated text={r.title} width="max-w-[16rem]" /> },
    { key: "body", label: "Body", render: (r) => <Truncated text={r.body} width="max-w-[24rem]" /> },
    { key: "sortOrder", label: "Order", width: "80px" },
    { key: "active", label: "Status", width: "100px", render: (r) => <ActiveBadge on={!!r.active} /> },
  ];

  return (
    <>
      <DataGrid
        title="Page Content"
        columns={columns}
        reloadToken={reload}
        fetchPage={fetchPage}
        createLabel="Create Row"
        onCreate={() => { setEditing(null); setModalOpen(true); }}
        onEdit={(row) => { setEditing(row as ContentItem); setModalOpen(true); }}
        onDelete={remove}
        onBulkDelete={removeMany}
        searchPlaceholder="Search titles, body, sections…"
        filterState={filterState}
        filters={
          <select
            aria-label="Filter by section"
            className="rounded-lg border px-2 py-2 text-sm"
            style={optStyle}
            value={filterState.section || ""}
            onChange={(e) => setFilterState({ section: e.target.value })}>
            <option value="" style={optStyle}>All sections</option>
            {sections.map((s) => (
              <option key={s} value={s} style={optStyle}>{s}</option>
            ))}
          </select>
        }
      />

      {modalOpen && (
        <ContentItemModal
          editing={editing}
          sections={sections}
          defaultSection={filterState.section || ""}
          onClose={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </>
  );
}

// ------------------------------------------------------------------ modal
/**
 * Purpose-built rather than the shared EntityModal: this form needs a section
 * box that is both a picker and a free-text field (a new section is legitimate),
 * an icon picker that shows the actual icons, and a real boolean toggle — none
 * of which EntityModal's field descriptors can express.
 */
function ContentItemModal({
  editing, sections, defaultSection, onClose, onSave,
}: {
  editing: ContentItem | null;
  sections: string[];
  defaultSection: string;
  onClose: () => void;
  onSave: (payload: Partial<ContentItem>) => Promise<void>;
}) {
  const [form, setForm] = useState<any>({
    section: editing?.section ?? defaultSection ?? "",
    title: editing?.title ?? "",
    body: editing?.body ?? "",
    icon: editing?.icon ?? "",
    link: editing?.link ?? "",
    extra: editing?.extra ?? "",
    sortOrder: String(editing?.sortOrder ?? 0),
    active: editing ? !!editing.active : true,
  });
  const [saving, setSaving] = useState(false);
  const panelRef = useModalA11y(onClose);
  // useId() contains colons; strip them so the ids stay easy to reason about.
  const uid = useId().replace(/:/g, "");
  const titleId = `content-modal-title-${uid}`;
  const listId = `content-sections-${uid}`;

  const set = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));
  const guide = guideFor(form.section);

  const submit = async () => {
    const section = form.section.trim();
    if (!section) { toast.error("Section is required"); return; }
    if (!form.title.trim() && !form.body.trim()) {
      toast.error("Give the row a title or a body — one with neither shows nothing.");
      return;
    }
    const parsedOrder = Number(form.sortOrder);
    if (form.sortOrder !== "" && Number.isNaN(parsedOrder)) {
      toast.error("Sort order must be a number");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        section,
        title: form.title.trim() || null,
        body: form.body.trim() || null,
        icon: form.icon || null,
        link: form.link.trim() || null,
        extra: form.extra.trim() || null,
        sortOrder: form.sortOrder === "" ? 0 : parsedOrder,
        active: form.active,
      });
      onClose();
    } catch {
      // onSave has already reported it; keep the form open so nothing is lost.
    } finally {
      setSaving(false);
    }
  };

  const hint = (text?: string) =>
    text ? <p className="mt-1 text-[11px] opacity-55">{text}</p> : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="w-full max-w-lg rounded-2xl border p-6 max-h-[88vh] overflow-y-auto"
        style={{ background: "hsl(var(--card))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 id={titleId} className="text-lg font-bold">
            {editing ? "Edit content row" : "New content row"}
          </h2>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 opacity-60" /></button>
        </div>

        <div className="space-y-3">
          {/* Section — pick an existing one or type a brand new one */}
          <div>
            <label className="block text-xs font-medium mb-1 opacity-70" htmlFor={`${uid}-section`}>
              Section<span className="text-orange-500"> *</span>
            </label>
            <input id={`${uid}-section`} className={inp} list={listId} autoComplete="off"
              placeholder="HOME_FEATURE" value={form.section}
              onChange={(e) => set("section", e.target.value)} />
            <datalist id={listId}>
              {sections.map((s) => <option key={s} value={s} />)}
            </datalist>
            {hint("Pick a list from the suggestions, or type a new section name to start one.")}
          </div>

          <div className="rounded-lg border px-3 py-2 text-[11px] leading-relaxed opacity-70"
            style={{ background: "hsl(var(--muted))" }}>
            {guide.summary}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-70" htmlFor={`${uid}-title`}>Title</label>
            <input id={`${uid}-title`} className={inp} value={form.title}
              onChange={(e) => set("title", e.target.value)} />
            {hint(guide.title)}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-70" htmlFor={`${uid}-body`}>Body</label>
            <textarea id={`${uid}-body`} className={inp} rows={4} value={form.body}
              onChange={(e) => set("body", e.target.value)} />
            {hint(guide.body ?? "The paragraph shown under the title.")}
          </div>

          {/* Icon — a fixed allow-list, shown as the real icons */}
          <fieldset>
            <legend className="block text-xs font-medium mb-1 opacity-70">Icon</legend>
            <div className="grid grid-cols-2 gap-1 max-h-44 overflow-y-auto rounded-lg border p-2">
              <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-muted">
                <input type="radio" name={`icon-${uid}`} checked={form.icon === ""}
                  onChange={() => set("icon", "")} />
                <span className="opacity-60">No icon</span>
              </label>
              {CONTENT_ICON_NAMES.map((name) => {
                const Icon = contentIcon(name);
                return (
                  <label key={name}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-muted">
                    <input type="radio" name={`icon-${uid}`} checked={form.icon === name}
                      onChange={() => set("icon", name)} />
                    <Icon className="h-4 w-4 text-orange-500" aria-hidden="true" />
                    <span className="truncate">{name}</span>
                  </label>
                );
              })}
            </div>
            {hint(guide.icon ?? "Optional decoration shown with the row.")}
          </fieldset>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-70" htmlFor={`${uid}-link`}>Link</label>
            <input id={`${uid}-link`} className={inp} placeholder="https://… or mailto:…"
              value={form.link} onChange={(e) => set("link", e.target.value)} />
            {hint(guide.link ?? "Where the row links to. Leave blank for plain copy.")}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 opacity-70" htmlFor={`${uid}-extra`}>Extra</label>
              <input id={`${uid}-extra`} className={inp} value={form.extra}
                onChange={(e) => set("extra", e.target.value)} />
              {hint(guide.extra ?? "Spare slot — only some sections use it.")}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 opacity-70" htmlFor={`${uid}-order`}>Sort order</label>
              <input id={`${uid}-order`} className={inp} type="number" value={form.sortOrder}
                onChange={(e) => set("sortOrder", e.target.value)} />
              {hint("Low numbers come first within the section.")}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active}
              onChange={(e) => set("active", e.target.checked)} />
            Active — show this row on the public site
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            disabled={saving} onClick={submit}>
            {saving ? "Saving…" : editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
