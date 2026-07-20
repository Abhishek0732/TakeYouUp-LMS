import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Code2, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  useEffect(() => {
    document.title = "Sign Up | TakeYouUp - Master Programming & Build Your Future";
  }, []);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) 
        {
           if (typeof data === "object" && !data.message) {
            const firstError = Object.values(data)[0];
            throw new Error(firstError as string);
          }
          throw new Error(data.message || "Signup failed");
        }
      toast({ title: "Account Created", description: "Welcome to TakeYouUp!" });
      navigate("/login");
    } catch (error: any) {
      toast({ title: "Signup Failed", description: error.message || "Something went wrong", variant: "destructive" });
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

  const perks = ["Access all courses instantly", "Community support included", "Track your progress"];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-dots" style={{ background: "hsl(var(--background))" }}>
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full opacity-15 animate-blob pointer-events-none" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10 animate-blob-2 pointer-events-none" style={{ background: "radial-gradient(circle, #ffb800, transparent 70%)", filter: "blur(70px)" }} />

      <div className="w-full max-w-md rounded-3xl p-8 border animate-fade-up relative z-10" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}>
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="rounded-2xl p-3" style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}>
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ff4d1c" }}>Take</span>You<span style={{ color: "#ff4d1c" }}>Up</span>
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
            { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
            { label: "Email", key: "email", type: "email", placeholder: "your.email@example.com" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>{label}</label>
              <input type={type} placeholder={placeholder} style={inputStyle}
                value={formData[key as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                required onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          ))}

          {[
            { label: "Password", key: "password", show: showPw, toggle: () => setShowPw(!showPw), placeholder: "Create password" },
            { label: "Confirm Password", key: "confirmPassword", show: showConfirmPw, toggle: () => setShowConfirmPw(!showConfirmPw), placeholder: "Confirm password" },
          ].map(({ label, key, show, toggle, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>{label}</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder={placeholder}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  required onFocus={focusStyle} onBlur={blurStyle} />
                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
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

export default Signup;
