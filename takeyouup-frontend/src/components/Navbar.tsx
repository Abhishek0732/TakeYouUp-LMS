import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useState, useEffect, useRef } from "react";
import {
  Moon,
  Sun,
  Code2,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  BrainCircuit,
  ChartColumn,
  Languages,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resourceCategories } from "@/data/resources";

const resourceIcons: Record<string, any> = {
  "quantitative-aptitude": BrainCircuit,
  "data-interpretation": ChartColumn,
  "logical-reasoning": Target,
  "verbal-reasoning": Languages,
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileRes, setMobileRes] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Interview Prep", path: "/interview-prep" },
    { name: "Practice", path: "/online-compiler" },
    { name: "Problems", path: "/problems" },
    { name: "About", path: "/about" },
  ];

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false);
      if (resRef.current && !resRef.current.contains(e.target as Node))
        setResOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => {
    setDropOpen(false);
    setResOpen(false);
    setMobileOpen(false);
    setMobileRes(false);
  }, [location.pathname]);

  const isActive = (p: string) => location.pathname === p;
  const isResActive = location.pathname.startsWith("/resources");

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'DM Sans', sans-serif",
    color: active ? "#ff4d1c" : "hsl(var(--muted-foreground))",
    background: active ? "rgba(255,77,28,.08)" : "transparent",
  });

  return (
    <nav
      className="tyu-nav sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? "hsl(var(--background) / 0.92)"
          : "hsl(var(--background) / 0.7)",
        borderBottom: scrolled
          ? "1px solid hsl(var(--border))"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="group flex flex-shrink-0 items-center gap-2.5"
          >
            <div
              className="rounded-xl p-2 transition-all duration-300 group-hover:scale-105"
              style={{ background: "linear-gradient(135deg,#ff4d1c,#ffb800)" }}
            >
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: "'Syne',sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "#ff4d1c" }}>Take</span>You<span style={{ color: "#ff4d1c" }}>Up</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                style={linkStyle(isActive(link.path))}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color = "hsl(var(--foreground))";
                    e.currentTarget.style.background = "hsl(var(--muted))";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.color =
                      "hsl(var(--muted-foreground))";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {link.name}
                {isActive(link.path) && (
                  <span
                    className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: "#ff4d1c" }}
                  />
                )}
              </Link>
            ))}

            {/* Resources dropdown */}
            <div
              className="relative"
              ref={resRef}
              onMouseEnter={() => setResOpen(true)}
              onMouseLeave={() => setResOpen(false)}
            >
              <button
                type="button"
                className="relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                style={linkStyle(isResActive)}
                onClick={() => navigate("/resources")}
              >
                <span className="flex items-center gap-1.5">
                  Resources{" "}
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-200"
                    style={{ transform: resOpen ? "rotate(180deg)" : "none" }}
                  />
                </span>
                {isResActive && (
                  <span
                    className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: "#ff4d1c" }}
                  />
                )}
              </button>
              {resOpen && (
                <div className="absolute right-0 top-full z-50 w-[540px] pt-2">
                  <div
                    className="overflow-hidden rounded-[24px] border animate-fade-down"
                    style={{
                      background: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      boxShadow: "0 26px 70px rgba(0,0,0,.18)",
                    }}
                  >
                    <div className="grid md:grid-cols-[200px_1fr]">
                      <div
                        className="border-r p-5"
                        style={{
                          borderColor: "hsl(var(--border))",
                          background: "hsl(var(--muted)/.35)",
                        }}
                      >
                        <div
                          className="mb-2 text-xs uppercase tracking-[.2em] text-muted-foreground"
                          style={{ fontFamily: "'DM Mono',monospace" }}
                        >
                          Resource Hub
                        </div>
                        <h3 className="mb-2 text-lg font-bold">
                          Practice by category
                        </h3>
                        <p className="text-xs leading-6 text-muted-foreground">
                          Aptitude, reasoning, DI and verbal in one place.
                        </p>
                        <Link
                          to="/resources"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
                          style={{
                            color: "#ff4d1c",
                            fontFamily: "'Syne',sans-serif",
                          }}
                        >
                          View all →
                        </Link>
                      </div>
                      <div className="grid gap-1.5 p-3">
                        {resourceCategories.map((cat) => {
                          const Icon = resourceIcons[cat.slug] ?? BookOpen;
                          return (
                            <Link
                              key={cat.slug}
                              to={`/resources/${cat.slug}`}
                              className="group rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-border hover:bg-muted/45"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                                  style={{
                                    background: `linear-gradient(135deg,${cat.accent},#ffb800)`,
                                  }}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">
                                      {cat.title}
                                    </span>
                                    
                                  </div>
                                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                                    {cat.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 transition-all hover:bg-muted"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {theme === "dark" ? (
                <Sun style={{ width: 18, height: 18 }} />
              ) : (
                <Moon style={{ width: 18, height: 18 }} />
              )}
            </button>
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all hover:border-orange-400"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontFamily: "'Syne',sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                    }}
                  >
                    {user.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U"}
                  </div>
                  <span
                    className="hidden max-w-20 truncate text-sm font-medium sm:block"
                    style={{ fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {user.name}
                  </span>
                  <ChevronDown
                    className="h-3.5 w-3.5 opacity-50"
                    style={{
                      transition: "transform .2s",
                      transform: dropOpen ? "rotate(180deg)" : "none",
                    }}
                  />
                </button>
                {dropOpen && (
                  <div
                    className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border py-2 shadow-xl animate-fade-down"
                    style={{
                      background: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      boxShadow: "0 16px 40px rgba(0,0,0,.12)",
                    }}
                  >
                    <div
                      className="mb-1 border-b px-4 py-2 text-xs uppercase tracking-wider opacity-50"
                      style={{
                        borderColor: "hsl(var(--border))",
                        fontFamily: "'DM Mono',monospace",
                      }}
                    >
                      {user.email}
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                      onClick={() => setDropOpen(false)}
                    >
                      <User className="h-4 w-4 opacity-60" /> Profile
                    </Link>
                    <Link
                      to="/certificates"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                      onClick={() => setDropOpen(false)}
                    >
                      <User className="h-4 w-4 opacity-60" /> My Certificates
                    </Link>
                    {localStorage.getItem("role") === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                        onClick={() => setDropOpen(false)}
                      >
                        <User className="h-4 w-4 opacity-60" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setDropOpen(false);
                        navigate("/login");
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted"
                      style={{ color: "#ff4d1c" }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-muted"
                  style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600 }}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-orange hidden sm:inline-flex"
                  style={{ padding: "9px 20px", fontSize: "13px" }}
                >
                  Get Started
                </Link>
              </>
            )}
            <button
              className="rounded-lg p-2 transition-colors hover:bg-muted lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="border-t py-4 animate-fade-down lg:hidden"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setMobileRes(!mobileRes)}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium transition-all flex items-center justify-between"
                style={{
                  color: isResActive
                    ? "#ff4d1c"
                    : "hsl(var(--muted-foreground))",
                  background: isResActive
                    ? "rgba(255,77,28,.08)"
                    : "transparent",
                }}
              >
                Resources{" "}
                <ChevronDown
                  className="h-4 w-4 transition-transform"
                  style={{ transform: mobileRes ? "rotate(180deg)" : "none" }}
                />
              </button>
              {mobileRes && (
                <div className="mb-2 rounded-2xl bg-muted/40 p-2">
                  <Link
                    to="/resources"
                    onClick={() => setMobileOpen(false)}
                    className="mb-1 block rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
                  >
                    All Resources
                  </Link>
                  {resourceCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/resources/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium transition-all"
                  style={{
                    color: isActive(link.path)
                      ? "#ff4d1c"
                      : "hsl(var(--muted-foreground))",
                    background: isActive(link.path)
                      ? "rgba(255,77,28,.08)"
                      : "transparent",
                  }}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/signup"
                  className="btn-orange mt-2 justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
