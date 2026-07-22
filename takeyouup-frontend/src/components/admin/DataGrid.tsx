import React, { useEffect, useMemo, useState } from "react";
import { Search, Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { TableRowsSkeleton } from "@/components/Skeletons";
import StateMessage from "@/components/StateMessage";

export interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  width?: string;
}

interface Props {
  title: string;
  columns: Column[];
  idKey?: string;
  /** Returns rows + total for the given paging/search/filter state. */
  fetchPage: (args: { page: number; size: number; search: string; filters: any }) => Promise<{ rows: any[]; total: number }>;
  reloadToken?: number;
  createLabel?: string;
  onCreate?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => Promise<void> | void;
  onBulkDelete?: (rows: any[]) => Promise<void> | void;
  rowActions?: (row: any) => React.ReactNode;
  filters?: React.ReactNode;
  filterState?: any;
  searchPlaceholder?: string;
}

const cell = "px-4 py-3 text-sm align-top";

export default function DataGrid({
  title, columns, idKey = "id", fetchPage, reloadToken = 0,
  createLabel, onCreate, onEdit, onDelete, onBulkDelete, rowActions,
  filters, filterState, searchPlaceholder = "Search…",
}: Props) {
  const hasActions = !!(onEdit || onDelete || rowActions);
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(25);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  /** Non-null only when the last fetch failed — kept apart from an empty result. */
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [selected, setSelected] = useState<Set<any>>(new Set());

  const totalPages = Math.max(1, Math.ceil(total / size));

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchPage({ page, size, search, filters: filterState })
      .then((r) => { if (alive) { setRows(r.rows); setTotal(r.total); setError(null); } })
      .catch((e: any) => {
        if (alive) {
          setRows([]); setTotal(0);
          setError(e?.response?.data?.message || e?.message || "The server did not respond.");
        }
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [page, size, search, reloadToken, retryToken, JSON.stringify(filterState)]);

  // reset to first page when the query narrows
  useEffect(() => { setPage(0); setSelected(new Set()); }, [search, size, JSON.stringify(filterState), reloadToken]);

  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r[idKey]));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) rows.forEach((r) => next.delete(r[idKey]));
    else rows.forEach((r) => next.add(r[idKey]));
    setSelected(next);
  };
  const toggleOne = (id: any) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const selectedRows = useMemo(() => rows.filter((r) => selected.has(r[idKey])), [rows, selected]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h1>
        {createLabel && onCreate && (
          <button onClick={onCreate}
            className="flex items-center gap-2 rounded-lg bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
            <Plus className="h-4 w-4" /> {createLabel}
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
          <input
            className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm bg-transparent"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filters}
        <span className="text-sm opacity-60">{total} Results</span>
        <select className="rounded-lg border px-2 py-2 text-sm"
          style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
          value={size} onChange={(e) => setSize(Number(e.target.value))}>
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n} style={{ background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}>{n} / page</option>
          ))}
        </select>
      </div>

      {/* Bulk actions */}
      {selectedRows.length > 0 && onBulkDelete && (
        <div className="mb-3 flex items-center gap-3 text-sm">
          <span>{selectedRows.length} selected</span>
          <button className="text-red-500 flex items-center gap-1"
            onClick={async () => {
              if (confirm(`Delete ${selectedRows.length} item(s)?`)) { await onBulkDelete(selectedRows); setSelected(new Set()); }
            }}>
            <Trash2 className="h-4 w-4" /> Delete selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background: "hsl(var(--muted))" }}>
              <th className={cell + " w-10"}>
                <input type="checkbox" aria-label="Select all rows" checked={allChecked} onChange={toggleAll} />
              </th>
              {columns.map((c) => (
                <th key={c.key} className={cell + " text-left font-semibold"} style={{ width: c.width }}>{c.label}</th>
              ))}
              {hasActions && <th className={cell + " text-right"}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <TableRowsSkeleton rows={size > 10 ? 10 : size} columns={columns.length + (hasActions ? 2 : 1)} />
            )}
            {!loading && error && (
              <tr>
                <td className="p-0" colSpan={columns.length + (hasActions ? 2 : 1)}>
                  <StateMessage
                    tone="error"
                    title={`Couldn't load ${title.toLowerCase()}`}
                    description={`${error} — the records are still there, the list just failed to load.`}
                    onRetry={() => setRetryToken((n) => n + 1)}
                    retryLabel="Retry"
                    className="border-none"
                  />
                </td>
              </tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr><td className={cell + " opacity-60"} colSpan={columns.length + (hasActions ? 2 : 1)}>No records found.</td></tr>
            )}
            {!loading && !error && rows.map((row) => (
              <tr key={row[idKey]} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                <td className={cell}>
                  <input type="checkbox" aria-label={`Select row ${row[idKey]}`} checked={selected.has(row[idKey])} onChange={() => toggleOne(row[idKey])} />
                </td>
                {columns.map((c) => (
                  <td key={c.key} className={cell}>{c.render ? c.render(row) : String(row[c.key] ?? "")}</td>
                ))}
                {hasActions && (
                  <td className={cell}>
                    <div className="flex items-center justify-end gap-3">
                      {rowActions && rowActions(row)}
                      {onEdit && (
                        <button className="opacity-70 hover:opacity-100" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button className="text-red-500 opacity-80 hover:opacity-100" title="Delete" aria-label="Delete"
                          onClick={async () => { if (confirm("Delete this record?")) await onDelete(row); }}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-3 mt-4 text-sm">
        <span className="opacity-60">Page {page + 1} of {totalPages}</span>
        <button className="rounded-lg border p-1.5 disabled:opacity-30" disabled={page <= 0} aria-label="Previous page"
          onClick={() => setPage((p) => Math.max(0, p - 1))}><ChevronLeft className="h-4 w-4" /></button>
        <button className="rounded-lg border p-1.5 disabled:opacity-30" disabled={page + 1 >= totalPages} aria-label="Next page"
          onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
