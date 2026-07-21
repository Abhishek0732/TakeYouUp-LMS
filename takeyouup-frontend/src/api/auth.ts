import api from "@/api/axios";

/**
 * Auth calls go through the shared axios instance so they inherit the relative
 * baseURL — the app keeps working on whatever host serves the frontend.
 */

export const loginUser = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

/** Confirms an address from the link in the verification email. */
export const verifyEmail = async (token: string) => {
  const { data } = await api.get("/auth/verify", { params: { token } });
  return data;
};

export const resendVerification = async (email: string) => {
  const { data } = await api.post("/auth/resend-verification", { email });
  return data;
};

/** Always resolves for a well-formed address — the API never reveals whether it exists. */
export const requestPasswordReset = async (email: string) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

/** Checks a reset link before showing the form, so dead links fail fast. */
export const validateResetToken = async (token: string) => {
  const { data } = await api.get("/auth/reset-password/validate", { params: { token } });
  return data;
};

export const resetPassword = async (token: string, password: string) => {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
};
