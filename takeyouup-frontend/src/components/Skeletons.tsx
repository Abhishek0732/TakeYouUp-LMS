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

/** Resource category cards — big rounded tiles: accent bar, icon, title, blurb, link. */
export const ResourceCategoriesSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-6 md:grid-cols-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="relative overflow-hidden rounded-[28px] border p-7">
        <Skeleton className="absolute inset-x-0 top-0 h-1 rounded-none" />
        <Skeleton className="mb-6 h-14 w-14 rounded-2xl" />
        <Skeleton className="mb-3 h-7 w-1/2" />
        <div className="mb-6 space-y-2.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="h-4 w-36" />
      </div>
    ))}
  </div>
);

/** Topic cards inside a category — mirrors the card: difficulty pill, title, blurb, link. */
export const ResourceTopicsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-6 md:grid-cols-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-[28px] border p-6">
        <Skeleton className="mb-4 h-6 w-24 rounded-full" />
        <Skeleton className="mb-3 h-7 w-1/2" />
        <div className="mb-6 space-y-2.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>
    ))}
  </div>
);

/** MCQ practice view — hero, a 300px sidebar (progress + concepts) and the question card. */
export const QuizSkeleton = () => (
  <div>
    <Skeleton className="mb-6 h-4 w-40" />
    <Skeleton className="mb-3 h-3 w-24" />
    <Skeleton className="mb-3 h-8 w-1/2" />
    <TextSkeleton lines={1} className="max-w-3xl" />

    <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-5">
        {/* Progress card */}
        <div className="rounded-[24px] border p-5">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="mt-5 grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-xl" />
            ))}
          </div>
        </div>
        {/* Key concepts card */}
        <div className="rounded-[24px] border p-5">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="flex flex-wrap gap-2">
            {[68, 52, 84, 60, 44].map((w, i) => (
              <Skeleton key={i} className="h-6 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </aside>

      {/* Question card */}
      <div className="rounded-[28px] border p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="mb-3 h-7 w-11/12" />
        <Skeleton className="mb-8 h-7 w-3/4" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border p-3">
              <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
              <Skeleton className="h-4" style={{ width: `${70 - i * 8}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/** Grid of blog cards — mirrors BlogCard: cover, topic pill, title, excerpt, meta. */
export const BlogGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col overflow-hidden rounded-2xl border">
        <Skeleton className="w-full rounded-none" style={{ aspectRatio: "16/9" }} />
        <div className="flex flex-1 flex-col p-5">
          <Skeleton className="mb-3 h-5 w-20 rounded-full" />
          <Skeleton className="mb-2 h-5 w-4/5" />
          <TextSkeleton lines={3} className="mb-4" />
          <div className="mt-auto flex items-center gap-3 pt-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="ml-auto h-3 w-14" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/** A single article — one narrow column: back link, title, lead, meta, cover, body. */
export const ArticleSkeleton = () => (
  <div className="mx-auto max-w-3xl">
    <Skeleton className="mb-6 h-4 w-28" />
    <Skeleton className="mb-4 h-6 w-24 rounded-full" />
    <Skeleton className="mb-3 h-9 w-11/12" />
    <Skeleton className="mb-6 h-9 w-2/3" />
    <TextSkeleton lines={2} className="mb-6" />
    <div className="mb-8 flex flex-wrap items-center gap-4">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="mb-8 w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
    <div className="space-y-3">
      <TextSkeleton lines={4} />
      <Skeleton className="h-40 w-full rounded-xl" />
      <TextSkeleton lines={3} />
    </div>
  </div>
);

/** Author's own posts — stacked rows with a title/meta block and a cluster of actions. */
export const PostRowsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-9 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/** A stacked form — label + field pairs, for editor screens. */
export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => (
  <div className="space-y-5">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="w-full rounded-lg" style={{ height: i === fields - 1 ? 200 : 44 }} />
      </div>
    ))}
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
