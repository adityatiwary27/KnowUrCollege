import axios from "axios";

const api = axios.create({
  baseURL: typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE || `${window.location.protocol}//${window.location.hostname}:8081/api`) : (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8081/api"),
});

// Attach JWT from localStorage on requests when available
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        if (!("Authorization" in config.headers)) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Log and rethrow errors globally to help debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      console.error("API error:", error?.response?.status, error?.response?.data || error.message);
    } catch (e) {
      console.error("API error unknown", e);
    }
    return Promise.reject(error);
  }
);

export default api;
