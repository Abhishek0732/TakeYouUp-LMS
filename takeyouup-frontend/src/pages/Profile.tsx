import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Edit3, Save, X, User, Mail, Camera } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Profile | TakeYouUp - Master Programming & Build Your Future";
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
    else setName(user.name);
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(`${API}/api/users/update-name`, { name }, { headers: { Authorization: `Bearer ${token}` } });
      login({ ...user, name });
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully" });
      setEditMode(false);
    } catch {
      toast({ title: "Update Failed", description: "Failed to update profile. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-dots" style={{ background: "hsl(var(--background))" }}>
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15 animate-blob pointer-events-none" style={{ background: "radial-gradient(circle, #ff4d1c, transparent 70%)", filter: "blur(80px)" }} />

      <div className="w-full max-w-sm animate-fade-up relative z-10">
        <div className="rounded-3xl p-8 border" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <img src={user.avatar || "https://i.pravatar.cc/150"} alt="avatar" className="h-24 w-24 rounded-2xl object-cover" style={{ border: "3px solid #ff4d1c" }} />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "linear-gradient(135deg, #ff4d1c, #ffb800)" }}>
                <Camera className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center text-xl font-bold bg-transparent border-b-2 outline-none pb-1"
                style={{ fontFamily: "'Syne', sans-serif", borderColor: "#ff4d1c", width: "100%", maxWidth: 220 }}
                autoFocus
              />
            ) : (
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>{user.name}</h2>
            )}
          </div>

          {/* Info */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
              <User className="h-4 w-4" style={{ color: "#ff4d1c" }} />
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>Name</p>
                <p className="text-sm font-medium">{editMode ? name : user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
              <Mail className="h-4 w-4" style={{ color: "#ff4d1c" }} />
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "hsl(var(--muted-foreground))" }}>Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {editMode ? (
              <>
                <button onClick={handleSave} disabled={loading} className="btn-orange w-full justify-center" style={{ borderRadius: "12px" }}>
                  <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setEditMode(false)} className="btn-outline-dark w-full justify-center" style={{ color: "hsl(var(--foreground))" }}>
                  <X className="h-4 w-4" /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="btn-outline-dark w-full justify-center"
                style={{ color: "hsl(var(--foreground))", borderRadius: "12px", padding: "12px" }}
              >
                <Edit3 className="h-4 w-4" /> Edit Profile
              </button>
            )}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1.5px solid rgba(239,68,68,0.2)", cursor: "pointer", fontFamily: "'Syne', sans-serif" }}
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
