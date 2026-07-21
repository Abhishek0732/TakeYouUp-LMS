import { useState } from "react";
import { MailWarning, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resendVerification } from "@/api/auth";

/**
 * Sitewide nudge for accounts that haven't confirmed their address yet.
 *
 * Verification is not enforced at login by default, so this banner is the
 * prompt. It disappears the moment the account is verified, and can be
 * dismissed for the current session.
 */
const VerifyEmailBanner = () => {
  const { user, emailVerified } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!user || emailVerified !== false || dismissed) return null;

  const resend = async () => {
    setSending(true);
    try {
      await resendVerification(user.email);
      setSent(true);
    } catch {
      setSent(true); // the API answers the same way regardless — never leak status
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-sm"
      style={{ background: "rgba(255,184,0,0.12)", borderBottom: "1px solid rgba(255,184,0,0.3)" }}
    >
      <MailWarning className="h-4 w-4 flex-shrink-0" style={{ color: "#ffb800" }} />
      <span style={{ color: "hsl(var(--foreground))" }}>
        Confirm your email address to secure your account.
      </span>
      {sent ? (
        <span style={{ color: "hsl(var(--muted-foreground))" }}>
          Sent — check your inbox.
        </span>
      ) : (
        <button
          onClick={resend}
          disabled={sending}
          className="font-semibold hover:underline inline-flex items-center gap-1"
          style={{ color: "#ff4d1c", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {sending && <Loader2 className="h-3 w-3 animate-spin" />}
          {sending ? "Sending…" : "Resend the link"}
        </button>
      )}
      <button
        onClick={() => setDismissed(true)}
        title="Dismiss"
        className="ml-1 opacity-50 hover:opacity-90"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default VerifyEmailBanner;
