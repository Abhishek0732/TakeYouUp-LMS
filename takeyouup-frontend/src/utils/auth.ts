import { jwtDecode } from "jwt-decode";

/** Tolerance for clock drift between the browser and the server. */
const SKEW_SECONDS = 10;

/** Expiry as epoch milliseconds, or null if the token carries no usable exp. */
export const tokenExpiry = (token: string): number | null => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const expiresAt = tokenExpiry(token);
  if (expiresAt === null) return true;
  return expiresAt - SKEW_SECONDS * 1000 < Date.now();
};
