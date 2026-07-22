import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

/**
 * The panel shown when a list has nothing in it.
 *
 * It exists because "empty" and "failed" used to look identical across the app:
 * a failed fetch would fall through to the same blank grid as a genuinely empty
 * one, so an outage read as "there is no content here" — and in the admin
 * console, as "the records were deleted". Passing `tone="error"` gives the
 * failure its own wording and a retry action, so the two can never be confused.
 */
export type StateMessageProps = {
  tone?: "empty" | "error";
  title: string;
  /** One line explaining what to do next. */
  description?: string;
  icon?: LucideIcon;
  onRetry?: () => void;
  retryLabel?: string;
  /** Renders in place of the retry button — e.g. a Link to somewhere useful. */
  action?: React.ReactNode;
  className?: string;
};

const StateMessage = ({
  tone = "empty",
  title,
  description,
  icon,
  onRetry,
  retryLabel = "Try again",
  action,
  className = "",
}: StateMessageProps) => {
  const isError = tone === "error";
  const Icon = icon ?? (isError ? AlertCircle : Inbox);
  const accent = isError ? "#ef4444" : "hsl(var(--muted-foreground))";

  return (
    <div
      role={isError ? "alert" : undefined}
      className={`rounded-2xl border text-center ${className}`}
      style={{
        borderColor: isError ? "rgba(239,68,68,0.35)" : "hsl(var(--border))",
        background: "hsl(var(--card))",
        padding: "40px 24px",
      }}
    >
      <div
        className="mx-auto mb-4 flex items-center justify-center"
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: isError ? "rgba(239,68,68,0.12)" : "hsl(var(--muted))",
        }}
      >
        <Icon style={{ width: 20, height: 20, color: accent }} />
      </div>

      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: "1.05rem",
          marginBottom: description ? 6 : 0,
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            color: "hsl(var(--muted-foreground))",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          {description}
        </p>
      )}

      {action}

      {!action && onRetry && (
        <button
          onClick={onRetry}
          className="btn-orange mt-5 mx-auto"
          style={{ borderRadius: 10, padding: "9px 16px", fontSize: 13 }}
        >
          <RefreshCw style={{ width: 14, height: 14 }} /> {retryLabel}
        </button>
      )}
    </div>
  );
};

export default StateMessage;
