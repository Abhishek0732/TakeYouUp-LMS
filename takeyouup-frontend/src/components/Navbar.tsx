import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";
import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Code2, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Interview Prep", path: "/interview-prep" },
    { name: "Practice", path: "/online-compiler" },
    { name: "Problems", path: "/problems" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="tyu-nav sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? "hsl(var(--background) / 0.92)"
          : "hsl(var(--background) / 0.7)",
        borderBottom: scrolled ? "1px solid hsl(var(--border))" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="rounded-xl p-2 transition-all duration-300 group-hover:scale-105"
              style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}
            >
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span
              className="text-lg font-bold"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
            >
              TakeYou<span style={{ color: "#ff4d1c" }}>Up</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: isActive(link.path)
                    ? "#ff4d1c"
                    : "hsl(var(--muted-foreground))",
                  background: isActive(link.path)
                    ? "rgba(255,77,28,0.08)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--foreground))";
                    (e.currentTarget as HTMLElement).style.background = "hsl(var(--muted))";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    (e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                {link.name}
                {isActive(link.path) && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "#ff4d1c" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-muted"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {theme === "dark"
                ? <Sun className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                : <Moon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              }
            </button>

            {/* User */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 hover:border-orange-400"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <img
                    src={user.avatar || "https://i.pravatar.cc/40"}
                    alt="avatar"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium hidden sm:block max-w-20 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" style={{ transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }} />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-2xl border shadow-xl py-2 z-50 animate-fade-down"
                    style={{
                      background: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
                    }}
                  >
                    <div className="px-4 py-2 text-xs font-mono-custom opacity-50 uppercase tracking-wider border-b mb-1" style={{ borderColor: "hsl(var(--border))", fontFamily: "'DM Mono', monospace" }}>
                      {user.email}
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 opacity-60" /> Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); navigate("/login"); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm w-full text-left transition-colors hover:bg-muted"
                      style={{ color: "#ff4d1c" }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-orange hidden sm:inline-flex"
                style={{ padding: "9px 20px", fontSize: "13px" }}
              >
                Sign In
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t py-4 animate-fade-down"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: isActive(link.path) ? "#ff4d1c" : "hsl(var(--muted-foreground))",
                    background: isActive(link.path) ? "rgba(255,77,28,0.08)" : "transparent",
                  }}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  className="btn-orange mt-2 justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
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
