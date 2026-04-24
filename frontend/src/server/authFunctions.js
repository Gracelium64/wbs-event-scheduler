import { BASE_URL } from "./config.js";

export async function registerUser({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Registration failed");
  }
  return body.data;
}
// await registerUser({ email: "test@test.com", password: "password" });

// function handleLogout() {
//   logoutUser();
//   setIsLoggedIn(false);
//   navigate("/");
// }
