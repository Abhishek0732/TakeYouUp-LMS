import { ReactNode } from "react";
import { Code2 } from "lucide-react";

/** Shared shell for the standalone auth pages (verify, forgot, reset). */
const AuthCard = ({ title, subtitle, children }: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) => (
  <div
    className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-dots"
    style={{ background: "hsl(var(--background))" }}
  >
    <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 animate-blob pointer-events-none"
      style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />
    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 animate-blob-2 pointer-events-none"
      style={{ background: "radial-gradient(circle, #ffb800, transparent 70%)", filter: "blur(70px)" }} />

    <div
      className="w-full max-w-md rounded-3xl p-8 border animate-fade-up relative z-10"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}
    >
      <div className="flex flex-col items-center gap-3 mb-7">
        <div className="rounded-2xl p-3" style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}>
          <Code2 className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-xl font-bold text-center" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-center" style={{ color: "hsl(var(--muted-foreground))" }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  </div>
);

export const authInputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: "10px",
  border: "1.5px solid hsl(var(--border))", background: "hsl(var(--background))",
  fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "inherit", outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default AuthCard;
