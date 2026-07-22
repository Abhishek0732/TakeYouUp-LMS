import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Mail } from "lucide-react";
import AuthCard, { authInputStyle } from "@/components/AuthCard";
import { verifyEmail, resendVerification } from "@/api/auth";
import { apiErrorMessage } from "@/api/errors";

type State = "checking" | "done" | "failed";

/** Landing page for the link in the verification email: /verify-email?token=… */
const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [state, setState] = useState<State>(token ? "checking" : "failed");
  const [message, setMessage] = useState(
    token ? "" : "This link is missing its token. Open the link from your email again."
  );
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState("");

  // React 18 StrictMode mounts effects twice in dev; the token is single-use,
  // so guard against firing the request a second time.
  const started = useRef(false);

  useEffect(() => {
    document.title = "Verify email | TakeYouUp";
    if (!token || started.current) return;
    started.current = true;

    verifyEmail(token)
      .then(() => {
        setState("done");
        setMessage("Your email address is confirmed.");
      })
      .catch((err) => {
        setState("failed");
        setMessage(apiErrorMessage(err, "We couldn't verify this link."));
      });
  }, [token]);

  const resend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);
    try {
      const res = await resendVerification(email);
      setResent(res.message || "Check your inbox for a fresh link.");
    } catch (err: any) {
      setResent(apiErrorMessage(err, "Could not send the email. Try again shortly."));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard title="Email verification">
      {state === "checking" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#ff4d1c" }} />
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Confirming your address…</p>
        </div>
      )}

      {state === "done" && (
        <div className="flex flex-col items-center gap-4 py-2">
          <CheckCircle2 className="h-12 w-12" style={{ color: "#22c55e" }} />
          <p className="text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{message}</p>
          <Link to="/login" className="btn-orange w-full justify-center" style={{ borderRadius: 12 }}>
            <span>Continue to sign in</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {state === "failed" && (
        <div className="flex flex-col items-center gap-4">
          <XCircle className="h-12 w-12" style={{ color: "#ef4444" }} />
          <p className="text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{message}</p>

          <form onSubmit={resend} className="w-full space-y-3 pt-2">
            <label htmlFor="verify-email" className="block text-xs font-semibold uppercase tracking-wider"
              style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
              Send a new link
            </label>
            <input
              id="verify-email" autoComplete="email" inputMode="email"
              type="email" required placeholder="your.email@example.com" style={authInputStyle}
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={resending}
              className="btn-orange w-full justify-center" style={{ borderRadius: 12, opacity: resending ? 0.7 : 1 }}>
              <Mail className="h-4 w-4" />
              <span>{resending ? "Sending…" : "Resend verification email"}</span>
            </button>
            {resent && <p className="text-xs text-center" style={{ color: "hsl(var(--muted-foreground))" }}>{resent}</p>}
          </form>

          <Link to="/login" className="text-sm font-semibold hover:underline" style={{ color: "#ff4d1c" }}>
            Back to sign in
          </Link>
        </div>
      )}
    </AuthCard>
  );
};

export default VerifyEmail;
