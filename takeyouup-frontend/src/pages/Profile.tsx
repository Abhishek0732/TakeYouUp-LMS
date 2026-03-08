import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setName(user.name);
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/api/users/update-name`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });

      setEditMode(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.avatar || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="h-28 w-28 rounded-full border-4 border-primary object-cover"
          />

          {editMode ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center"
            />
          ) : (
            <h2 className="text-2xl font-bold">{user.name}</h2>
          )}

          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {editMode ? (
            <>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Updating..." : "Save"}
              </Button>

              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Edit Profile
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;