import { Link } from "react-router-dom"
import { Code2, Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react"

const Footer = () => {
  const links = {
    Learn: [
      { name: "Courses", path: "/courses" },
      { name: "Resources", path: "/resources" },
      { name: "Interview Prep", path: "/interview-prep" },
      { name: "Practice", path: "/online-compiler" },
      { name: "Problems", path: "/problems" },
    ],
    Company: [
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
  };

  return (
    <footer
      className="mt-auto border-t"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div
                className="rounded-xl p-2"
                style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}
              >
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
              >
                <span style={{ color: "#ff4d1c" }}>Take</span>You<span style={{ color: "#ff4d1c" }}>Up</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              Elevate your programming skills with comprehensive courses, real-world projects, and expert mentorship.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href + Icon.name}
                  href={href}
                  className="p-2 rounded-lg border transition-all hover:border-orange-400 hover:text-orange-500"
                  style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))", opacity: 0.6 }}
              >
                {section}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm flex items-center gap-1 group transition-colors hover:text-orange-500"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {item.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>
            © {new Date().getFullYear()} TakeYouUp. All rights reserved.
          </p>
          <a
            href="mailto:info@takeyouup.com"
            className="flex items-center gap-2 text-xs transition-colors hover:text-orange-500"
            style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}
          >
            <Mail className="h-3.5 w-3.5" />
            info@takeyouup.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
