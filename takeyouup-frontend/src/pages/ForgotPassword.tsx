import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import AuthCard, { authInputStyle } from "@/components/AuthCard";
import { requestPasswordReset } from "@/api/auth";
import { apiErrorMessage } from "@/api/errors";

const ForgotPassword = () => {
  useEffect(() => { document.title = "Forgot password | TakeYouUp"; }, []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setError(apiErrorMessage(err, "Something went wrong. Try again shortly."));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="Check your inbox">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-12 w-12" style={{ color: "#22c55e" }} />
          <p className="text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            If <strong style={{ color: "hsl(var(--foreground))" }}>{email}</strong> has an account,
            a reset link is on its way. It expires in 60 minutes.
          </p>
          <p className="text-center text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Didn't get it? Check spam, or{" "}
            <button onClick={() => setSent(false)} className="font-semibold hover:underline"
              style={{ color: "#ff4d1c", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              try another address
            </button>.
          </p>
          <Link to="/login" className="btn-orange w-full justify-center" style={{ borderRadius: 12 }}>
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter the address you signed up with and we'll email you a link to choose a new password."
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
            Email
          </label>
          <input
            type="email" required placeholder="your.email@example.com" style={authInputStyle}
            value={email} onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {error && <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>}

        <button type="submit" disabled={loading} className="btn-orange w-full justify-center"
          style={{ borderRadius: 12, opacity: loading ? 0.7 : 1 }}>
          <Mail className="h-4 w-4" />
          <span>{loading ? "Sending…" : "Send reset link"}</span>
        </button>
      </form>

      <Link to="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold hover:underline"
        style={{ color: "#ff4d1c" }}>
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </AuthCard>
  );
};

export default ForgotPassword;
