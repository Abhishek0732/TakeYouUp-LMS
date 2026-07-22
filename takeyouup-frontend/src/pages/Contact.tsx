import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Send, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import useSeo from "@/hooks/useSeo"
import useSiteContent from "@/hooks/useSiteContent"
import { contentIcon } from "@/lib/contentIcons"

const Contact = () => {
  useSeo({
    title: "Contact",
    description:
      "Send a message to the TakeYouUp team about courses, collaborations or a course you would like to see, or reach us by email or phone.",
  });

  const { toast } = useToast()
  const { items, text } = useSiteContent()
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [sending, setSending] = useState(false)
  const [signedIn] = useState(() => !!localStorage.getItem("token"))
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Message Sent!", description: "We've received your message and sent a confirmation email." });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({ title: "Error", description: res.status === 403 ? "Please log in to send a message." : "Failed to send message. Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again later.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const contactDetails = items("CONTACT_INFO");
  const faqs = items("CONTACT_FAQ");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid hsl(var(--border))",
    background: "hsl(var(--background))",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "inherit",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "6px",
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "hsl(var(--muted-foreground))",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 animate-blob" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="animate-fade-up max-w-2xl">
            <div className="section-tag">Reach Out</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-5" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              {text(
                "contact.hero.subtitle",
                "Have questions about our courses? Want to collaborate? We'd love to hear from you.",
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Form */}
          <div
            className="lg:col-span-2 rounded-3xl p-8 border animate-fade-up"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,77,28,0.1)" }}>
                <MessageSquare className="h-5 w-5" style={{ color: "#ff4d1c" }} />
              </div>
              <div>
                <h2 className="font-bold text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>Send Us a Message</h2>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "'DM Mono', monospace" }}>We'll respond within 24 hours</p>
              </div>
            </div>

            {!signedIn && (
              <div
                className="rounded-xl p-4 mb-6 border text-sm"
                style={{ background: "rgba(255,77,28,0.08)", borderColor: "rgba(255,77,28,0.25)" }}
              >
                You need to sign in to send a message.{" "}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: "#ff4d1c" }}>
                  Sign in
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>Name</label>
                  <input id="contact-name" autoComplete="name" style={inputStyle} placeholder="Your name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                    onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>Email</label>
                  <input id="contact-email" autoComplete="email" inputMode="email" type="email" style={inputStyle} placeholder="your.email@example.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                    onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }} />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
                <input id="contact-subject" style={inputStyle} placeholder="What is this regarding?" value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required
                  onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }} />
              </div>

              <div>
                <label htmlFor="contact-message" style={labelStyle}>Message</label>
                <textarea
                  id="contact-message"
                  style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  onFocus={(e) => { e.target.style.borderColor = "#ff4d1c"; e.target.style.boxShadow = "0 0 0 3px rgba(255,77,28,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border))"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <button type="submit" disabled={sending} className="btn-orange w-full justify-center" style={{ borderRadius: "12px", opacity: sending ? 0.7 : 1 }}>
                {sending ? "Sending..." : <><span>Send Message</span><Send className="h-4 w-4" /></>}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {contactDetails.map((item) => {
              const Icon = contentIcon(item.icon, Mail);
              return (
              <div
                key={item.id}
                className="card-lift rounded-2xl p-5 border flex items-start gap-4"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,77,28,0.1)" }}>
                  <Icon className="h-4.5 w-4.5" style={{ color: "#ff4d1c", width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>{item.title}</p>
                  {item.link
                    ? <a href={item.link} className="text-sm font-medium hover:text-orange-500 transition-colors">{item.body}</a>
                    : <p className="text-sm font-medium">{item.body}</p>}
                </div>
              </div>
              );
            })}

            <div
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}
            >
              <p className="font-bold text-white text-sm mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Quick Response</p>
              <p className="text-xs text-white/80">We typically respond within 24 hours during business days</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
        <div
          className="rounded-3xl p-8 border"
          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
        >
          <div className="section-tag">FAQ</div>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Frequently Asked Questions</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="border-b pb-5 last:border-0 last:pb-0" style={{ borderColor: "hsl(var(--border))" }}>
                <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                  <span className="text-xs font-mono-custom" style={{ color: "#ff4d1c", fontFamily: "'DM Mono', monospace" }}>Q{i + 1}.</span>
                  {faq.title}
                </h3>
                <p className="text-sm leading-relaxed pl-6" style={{ color: "hsl(var(--muted-foreground))" }}>{faq.body}</p>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
