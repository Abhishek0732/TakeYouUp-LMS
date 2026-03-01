import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  if (!user) return null

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

          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={() => alert("Edit profile coming soon")}
          >
            Edit Profile
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              logout()
              navigate("/")
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile