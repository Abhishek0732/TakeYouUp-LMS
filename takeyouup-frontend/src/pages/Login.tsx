import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Code2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  useEffect(() => {
    document.title = "Login | TakeYouUp - Master Programming & Build Your Future";
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      login({ name: data.name, email: data.email, avatar: "https://i.pravatar.cc/40" });
      toast({ title: "Login Successful", description: "Welcome to TakeYouUp!" });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.response?.data?.message || "Something went wrong", variant: "destructive" });
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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-dots"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 animate-blob pointer-events-none" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 animate-blob-2 pointer-events-none" style={{ background: "radial-gradient(circle, #ffb800, transparent 70%)", filter: "blur(70px)" }} />

      <div
        className="w-full max-w-md rounded-3xl p-8 border animate-fade-up relative z-10"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="rounded-2xl p-3" style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}>
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
            <span style={{ color: "#ff4d1c" }}>Take</span>You<span style={{ color: "#ff4d1c" }}>Up</span>
          </h1>
          <p className="text-sm text-center" style={{ color: "hsl(var(--muted-foreground))" }}>Welcome back! Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
              Email
            </label>
            <input
              type="email" placeholder="your.email@example.com"
              style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required
              onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
              onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} placeholder="Enter your password"
                style={{ ...inputStyle, paddingRight: "44px" }} value={password}
                onChange={(e) => setPassword(e.target.value)} required
                onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-orange w-full justify-center mt-2"
            style={{ borderRadius: "12px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "hsl(var(--muted-foreground))" }}>
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold hover:underline" style={{ color: "#ff4d1c" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
