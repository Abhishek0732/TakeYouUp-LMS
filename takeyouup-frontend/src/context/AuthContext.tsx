import { isTokenExpired } from "@/utils/auth";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  /** null while unknown (e.g. restored from a token that predates the flag). */
  emailVerified: boolean | null;
  login: (user: User, emailVerified?: boolean) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setEmailVerified: (verified: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VERIFIED_KEY = "emailVerified";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [emailVerified, setVerified] = useState<boolean | null>(null);

  const token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const localName = localStorage.getItem("userName");

        setUser({
          name: localName || payload.name,
          email: payload.sub,
          avatar: "https://i.pravatar.cc/40",
        });

        const stored = localStorage.getItem(VERIFIED_KEY);
        setVerified(stored === null ? null : stored === "true");
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem(VERIFIED_KEY);
      }
    }
  }, []);

  const login = (userData: User, verified?: boolean) => {
    localStorage.setItem("userName", userData.name);
    if (typeof verified === "boolean") {
      localStorage.setItem(VERIFIED_KEY, String(verified));
      setVerified(verified);
    }
    setUser(userData);
  };

  const setEmailVerified = (verified: boolean) => {
    localStorage.setItem(VERIFIED_KEY, String(verified));
    setVerified(verified);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem(VERIFIED_KEY);
    setUser(null);
    setVerified(null);
  };

  return (
    <AuthContext.Provider value={{ user, emailVerified, login, logout, setUser, setEmailVerified }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
