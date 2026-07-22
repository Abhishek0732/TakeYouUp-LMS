import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Code2, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/api/auth";
import { apiErrorMessage, fieldErrorsOf, FieldErrors } from "@/api/errors";
import useSeo from "@/hooks/useSeo";

/** Mirrors the server rule on RegisterRequest.password — keep the two in step. */
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PASSWORD_HINT = "Password must be at least 8 characters and include a letter and a number.";

const Signup = () => {
  useSeo({
    title: "Create Account",
    description:
      "Create a free TakeYouUp account to enrol in courses, save your progress lesson by lesson and claim a certificate when you finish.",
    noindex: true,
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Check the server's password rules here too, so the reason is instant
    // instead of arriving as a failed request.
    const localErrors: FieldErrors = {};
    if (!PASSWORD_RULE.test(formData.password)) {
      localErrors.password = PASSWORD_HINT;
    }
    if (formData.password !== formData.confirmPassword) {
      localErrors.confirmPassword = "The two passwords don't match.";
    }
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      toast({
        title: "Check the highlighted fields",
        description: Object.values(localErrors).join(" "),
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await registerUser(formData.name, formData.email, formData.password);
      toast({
        title: "Account created",
        description: `We've emailed a verification link to ${formData.email}. Confirm it to secure your account.`,
      });
      navigate("/login");
    } catch (error: any) {
      setErrors(fieldErrorsOf(error));
      toast({
        title: "Signup Failed",
        description: apiErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: "1.5px solid hsl(var(--border))", background: "hsl(var(--background))",
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "inherit", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none";
  };

  /** Clear a field's error as soon as the user starts fixing it. */
  const clearError = (key: string) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined as any } : prev));

  const perks = ["Access all courses instantly", "Community support included", "Track your progress"];

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 relative overflow-hidden bg-dots" style={{ background: "hsl(var(--background))" }}>
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-15 animate-blob pointer-events-none" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10 animate-blob-2 pointer-events-none" style={{ background: "radial-gradient(circle, #ffb800, transparent 70%)", filter: "blur(70px)" }} />

      <div className="w-full max-w-md rounded-3xl p-8 border animate-fade-up relative z-10" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}>
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="rounded-2xl p-3" style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}>
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <div className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ff4d1c" }}>Take</span>You<span style={{ color: "#ff4d1c" }}>Up</span>
          </div>
          <h1 className="text-xl font-bold text-center" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
            Create your account
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Create your free account today</p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {perks.map((p) => (
            <span key={p} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,77,28,0.08)", color: "#ff4d1c", fontFamily: "'DM Mono', monospace" }}>
              <CheckCircle2 className="h-3 w-3" /> {p}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Your full name", autoComplete: "name" },
            { label: "Email", key: "email", type: "email", placeholder: "your.email@example.com", autoComplete: "email" },
          ].map(({ label, key, type, placeholder, autoComplete }) => (
            <div key={key}>
              <label htmlFor={`signup-${key}`} className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>{label}</label>
              <input id={`signup-${key}`} type={type} placeholder={placeholder}
                autoComplete={autoComplete} inputMode={type === "email" ? "email" : undefined}
                style={errors[key] ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
                value={formData[key as keyof typeof formData]}
                onChange={(e) => { setFormData({ ...formData, [key]: e.target.value }); clearError(key); }}
                required onFocus={focusStyle} onBlur={blurStyle} />
              <FieldError message={errors[key]} />
            </div>
          ))}

          {[
            { label: "Password", key: "password", show: showPw, toggle: () => setShowPw(!showPw), placeholder: "Create password" },
            { label: "Confirm Password", key: "confirmPassword", show: showConfirmPw, toggle: () => setShowConfirmPw(!showConfirmPw), placeholder: "Confirm password" },
          ].map(({ label, key, show, toggle, placeholder }) => (
            <div key={key}>
              <label htmlFor={`signup-${key}`} className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>{label}</label>
              <div className="relative">
                <input id={`signup-${key}`} autoComplete="new-password" type={show ? "text" : "password"} placeholder={placeholder}
                  style={{ ...inputStyle, paddingRight: "44px", ...(errors[key] ? { borderColor: "#ef4444" } : {}) }}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => { setFormData({ ...formData, [key]: e.target.value }); clearError(key); }}
                  required onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" onClick={toggle} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError message={errors[key]} />
              {key === "password" && !errors[key] && (
                <p className="mt-1.5 text-[11px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {PASSWORD_HINT}
                </p>
              )}
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-orange w-full justify-center mt-2" style={{ borderRadius: "12px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating Account..." : <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: "#ff4d1c" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

/** Inline validation message shown under the offending input. */
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1.5 flex items-start gap-1.5 text-[11px]" style={{ color: "#ef4444" }}>
      <AlertCircle className="h-3 w-3 flex-shrink-0" style={{ marginTop: 1 }} />
      {message}
    </p>
  ) : null;

export default Signup;
