import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: any) => {
  const { user, ready } = useAuth();
  const location = useLocation();

  // Wait until the stored session has been checked. On a reload after the
  // 15-minute access token has expired, AuthProvider exchanges the refresh
  // token first — redirecting during that window would sign the user out for
  // no reason, which is exactly what used to happen after a spell of idling.
  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="skeleton h-40 w-full max-w-3xl rounded-2xl" />
      </div>
    );
  }

  if (!user && !localStorage.getItem("token")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
