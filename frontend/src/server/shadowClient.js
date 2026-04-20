import { ShadowAppClient } from "@shadow-app/react-sdk";

export const shadowClient = new ShadowAppClient({
  baseURL: import.meta.env.VITE_SHADOW_APP_BASE_URL || "http://localhost:8080",
  onTokenRefresh: (token) => {
    localStorage.setItem("token", token);
  },
  onAuthError: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
});

// Restore session from localStorage on module load
const storedToken = localStorage.getItem("token");
if (storedToken) {
  shadowClient.setToken(storedToken);
}
