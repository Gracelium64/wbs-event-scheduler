import { API_BASE_URL } from "./config.js";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to fetch profile");
  }
  return response.json();
}

// const profile = await getProfile();
