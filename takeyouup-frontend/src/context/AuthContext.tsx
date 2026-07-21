import { isTokenExpired, tokenExpiry } from "@/utils/auth";
import { clearSession, refreshAccessToken } from "@/api/axios";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
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
  /** False until the stored session has been checked (and refreshed if stale). */
  ready: boolean;
  login: (user: User, emailVerified?: boolean) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setEmailVerified: (verified: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VERIFIED_KEY = "emailVerified";

/** Refresh this long before the access token expires. */
const REFRESH_MARGIN_MS = 60_000;

function userFromToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: localStorage.getItem("userName") || payload.name,
      email: payload.sub,
      avatar: "https://i.pravatar.cc/40",
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [emailVerified, setVerified] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const renewTimer = useRef<number | null>(null);

  const readVerified = () => {
    const stored = localStorage.getItem(VERIFIED_KEY);
    return stored === null ? null : stored === "true";
  };

  /**
   * Restore the session on boot.
   *
   * The access token only lives 15 minutes but the refresh token lasts a week,
   * so an expired access token is NOT a logout — it just needs exchanging. The
   * previous version deleted the expired token during render and never touched
   * the refresh token, which is why leaving the app idle and coming back looked
   * like being signed out.
   */
  useEffect(() => {
    let alive = true;

    const restore = async () => {
      const token = localStorage.getItem("token");

      if (token && !isTokenExpired(token)) {
        const restored = userFromToken(token);
        if (alive && restored) {
          setUser(restored);
          setVerified(readVerified());
        }
        if (alive) setReady(true);
        return;
      }

      if (localStorage.getItem("refreshToken")) {
        try {
          const fresh = await refreshAccessToken();
          const restored = userFromToken(fresh);
          if (alive && restored) {
            setUser(restored);
            setVerified(readVerified());
          }
        } catch {
          clearSession();          // refresh token expired or revoked
        }
      } else if (token) {
        clearSession();            // expired access token, nothing to renew with
      }

      if (alive) setReady(true);
    };

    restore();
    return () => { alive = false; };
  }, []);

  /**
   * Renew shortly before expiry while the tab is open, so an idle session never
   * has to fail a request first. The interceptor still covers the case where
   * the machine was asleep and the timer never fired.
   */
  useEffect(() => {
    if (renewTimer.current) window.clearTimeout(renewTimer.current);
    if (!user) return;

    const token = localStorage.getItem("token");
    const expiresAt = token ? tokenExpiry(token) : null;
    if (!expiresAt) return;

    const delay = Math.max(expiresAt - Date.now() - REFRESH_MARGIN_MS, 5_000);
    renewTimer.current = window.setTimeout(() => {
      refreshAccessToken().catch(() => { /* interceptor handles the fallout */ });
    }, delay);

    return () => {
      if (renewTimer.current) window.clearTimeout(renewTimer.current);
    };
  }, [user, ready]);

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
    clearSession();
    setUser(null);
    setVerified(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, emailVerified, ready, login, logout, setUser, setEmailVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
