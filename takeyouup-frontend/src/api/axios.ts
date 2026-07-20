import axios from "axios";

// Empty base => relative "/api" paths, proxied by nginx to the backend. This
// makes the app work on whatever host/URL the frontend is served from.
const API = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// De-duplicate concurrent refreshes: if several requests 401 at once, they all
// await the same refresh call.
let refreshing: Promise<string> | null = null;

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("role");
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const refreshToken = localStorage.getItem("refreshToken");

    // On an expired access token, try to silently refresh once, then retry.
    if (status === 401 && !original._retry && refreshToken && !original.url?.includes("/auth/")) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = axios
            .post(`${API}/api/auth/refresh`, { refreshToken })
            .then((r) => {
              localStorage.setItem("token", r.data.token);
              if (r.data.refreshToken) {
                localStorage.setItem("refreshToken", r.data.refreshToken);
              }
              return r.data.token as string;
            })
            .finally(() => {
              refreshing = null;
            });
        }
        const newToken = await refreshing;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        clearSession();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
