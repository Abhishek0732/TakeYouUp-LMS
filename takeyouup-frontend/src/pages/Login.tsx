import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Code2 } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);

      login({
        name: data.name,
        email: data.email,
        avatar: "https://i.pravatar.cc/40",
      });

      toast({
        title: "Login Successful",
        description: "Welcome to TakeYouUp!",
      });

      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="rounded-xl bg-gradient-primary p-3 shadow-lg">
            <Code2 className="h-8 w-8 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TakeYouUp
          </h1>

          <p className="text-muted-foreground text-sm">
            Welcome back! Please login to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 bg-gradient-primary hover:opacity-90 transition-all"
          >
            Login
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
