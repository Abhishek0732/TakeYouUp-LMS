import { Skeleton } from "@/components/ui/skeleton";

/**
 * Reusable loading placeholders.
 *
 * Every one of these mirrors the shape of the content it replaces so the page
 * doesn't reflow when data lands. Nothing in the app should render the word
 * "Loading" — use one of these instead.
 */

const card = "rounded-2xl border p-5";

/** Rows of text lines, e.g. a paragraph or a description block. */
export const TextSkeleton = ({ lines = 3, className = "" }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-3.5" style={{ width: i === lines - 1 ? "62%" : "100%" }} />
    ))}
  </div>
);

/** Grid of media cards — course listings, resource categories. */
export const CardGridSkeleton = ({ count = 6, columns = 3, media = true }: {
  count?: number; columns?: 2 | 3 | 4; media?: boolean;
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 ${columns >= 3 ? "lg:grid-cols-3" : ""} ${columns === 4 ? "xl:grid-cols-4" : ""} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-2xl border overflow-hidden">
        {media && <Skeleton className="w-full rounded-none" style={{ aspectRatio: "16/9" }} />}
        <div className="p-6 space-y-3">
          <div className="flex gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <TextSkeleton lines={2} />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/** Stacked rows — lists of lessons, topics, certificates, attempts. */
export const ListSkeleton = ({ count = 5, height = 56 }: { count?: number; height?: number }) => (
  <div className="space-y-2.5">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="w-full rounded-xl" style={{ height }} />
    ))}
  </div>
);

/** Row of headline counters. */
export const StatsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={card}>
        <Skeleton className="h-4 w-4 mb-3 rounded" />
        <Skeleton className="h-7 w-14 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    ))}
  </div>
);

/** Admin data grid body — matches the real column count so nothing shifts. */
export const TableRowsSkeleton = ({ rows = 8, columns = 5 }: { rows?: number; columns?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, r) => (
      <tr key={r}>
        {Array.from({ length: columns }).map((_, c) => (
          <td key={c} className="px-4 py-3">
            <Skeleton className="h-3.5" style={{ width: c === 0 ? 20 : `${55 + ((r + c) % 4) * 10}%` }} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

/** Filter chips / pill rows. */
export const ChipsSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="flex flex-wrap gap-2">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-8 rounded-full" style={{ width: 70 + ((i * 37) % 60) }} />
    ))}
  </div>
);

/** Page hero: eyebrow, headline, standfirst. */
export const HeroSkeleton = () => (
  <div className="space-y-3 max-w-2xl">
    <Skeleton className="h-3 w-28" />
    <Skeleton className="h-10 w-2/3" />
    <TextSkeleton lines={2} />
  </div>
);

/** Sidebar + main content, e.g. a course or topic reading view. */
export const DetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-4">
      <div className={card}>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-3 w-24 mb-5" />
        <ListSkeleton count={6} height={34} />
      </div>
    </div>
    <div className="lg:col-span-8 space-y-4">
      <div className={card}>
        <Skeleton className="h-7 w-2/3 mb-5" />
        <TextSkeleton lines={4} className="mb-6" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  </div>
);
