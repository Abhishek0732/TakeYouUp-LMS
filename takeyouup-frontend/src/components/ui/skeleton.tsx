import { cn } from "@/lib/utils";

/**
 * Shimmering placeholder. Give it the size of the content it stands in for —
 * the point is that the layout does not shift when the real data arrives.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

export { Skeleton };
