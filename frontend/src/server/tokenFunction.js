import { shadowClient } from "./shadowClient.js";

export function getToken() {
  const token = shadowClient.getAccessToken() || localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");
  return token;
}
