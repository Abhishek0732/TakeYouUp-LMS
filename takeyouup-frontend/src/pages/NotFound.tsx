import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import useSeo from "@/hooks/useSeo";

const NotFound = () => {
  const location = useLocation();

  useSeo({
    title: "Page Not Found",
    description:
      "This address doesn't match anything on TakeYouUp — the page may have been renamed or removed. Head back to the home page to carry on.",
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 animate-blob pointer-events-none" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 animate-blob-2 pointer-events-none" style={{ background: "radial-gradient(circle, #ffb800, transparent 70%)", filter: "blur(80px)" }} />

      <div className="text-center animate-fade-up relative z-10">
        <p className="text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'DM Mono', monospace", color: "#ff4d1c" }}>
          Error 404
        </p>
        <h1
          className="text-9xl font-black mb-4 gradient-text"
          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.05em", lineHeight: 1 }}
        >
          404
        </h1>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
          Page Not Found
        </h2>
        <p className="mb-8 max-w-sm mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-orange">
          <Home className="h-4 w-4" /> Return Home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
