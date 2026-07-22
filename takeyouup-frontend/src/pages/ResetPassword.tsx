import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import AuthCard, { authInputStyle } from "@/components/AuthCard";
import { resetPassword, validateResetToken } from "@/api/auth";
import { apiErrorMessage } from "@/api/errors";
import useSeo from "@/hooks/useSeo";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PASSWORD_HINT = "At least 8 characters, including a letter and a number.";

/** Landing page for the link in the reset email: /reset-password?token=… */
const ResetPassword = () => {
  useSeo({
    title: "Reset Password",
    description:
      "Choose a new password for your TakeYouUp account using the link from your reset email, then sign back in with the new one.",
    noindex: true,
  });

  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setLinkError("This link is missing its token. Open the link from your email again.");
      setChecking(false);
      return;
    }
    // Validating up front avoids letting someone type a new password into a
    // form that was never going to work.
    validateResetToken(token)
      .catch((err) => setLinkError(apiErrorMessage(err, "This reset link is no longer valid.")))
      .finally(() => setChecking(false));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!PASSWORD_RULE.test(password)) {
      setError(PASSWORD_HINT);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      window.setTimeout(() => navigate("/login", { replace: true }), 2200);
    } catch (err: any) {
      setError(apiErrorMessage(err, "Could not reset the password. Request a new link."));
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <AuthCard title="Reset password">
        <div className="flex flex-col items-center gap-3 py-4">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#ff4d1c" }} />
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Checking your link…</p>
        </div>
      </AuthCard>
    );
  }

  if (linkError) {
    return (
      <AuthCard title="Link not valid">
        <div className="flex flex-col items-center gap-4">
          <XCircle className="h-12 w-12" style={{ color: "#ef4444" }} />
          <p className="text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{linkError}</p>
          <Link to="/forgot-password" className="btn-orange w-full justify-center" style={{ borderRadius: 12 }}>
            Request a new link
          </Link>
          <Link to="/login" className="text-sm font-semibold hover:underline" style={{ color: "#ff4d1c" }}>
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard title="Password updated">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-12 w-12" style={{ color: "#22c55e" }} />
          <p className="text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            You can sign in with your new password now. Taking you there…
          </p>
          <Link to="/login" className="btn-orange w-full justify-center" style={{ borderRadius: 12 }}>
            <span>Sign in</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </AuthCard>
    );
  }

  const field = (id: string, label: string, value: string, onChange: (v: string) => void) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id} autoComplete="new-password"
          type={show ? "text" : "password"} required placeholder="••••••••"
          style={{ ...authInputStyle, paddingRight: 44 }}
          value={value} onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
          onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }}
        />
        <button type="button" onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
          style={{ background: "none", border: "none", cursor: "pointer" }}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <AuthCard title="Choose a new password" subtitle={PASSWORD_HINT}>
      <form onSubmit={submit} className="space-y-4">
        {field("reset-password", "New password", password, setPassword)}
        {field("reset-confirm-password", "Confirm password", confirm, setConfirm)}

        {error && <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>}

        <button type="submit" disabled={saving} className="btn-orange w-full justify-center"
          style={{ borderRadius: 12, opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPassword;
