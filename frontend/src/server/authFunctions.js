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

export async function loginUser({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Login failed");
  }
  const { id, email: userEmail, role, token } = body.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({ id, email: userEmail, role }));
  return body.data;
}
// function handleLogIn({ email, password }) {
//   await loginUser({ email, password });
//   setIsLoggedIn(true);
//   navigate('/');
// }

export function getLoggedUser() {
  const user = localStorage.getItem("user");
  if (!user) throw new Error("No logged in user found");
  return JSON.parse(user);
}

// const loggedUser = getLoggedUser();

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// function handleLogout() {
//   logoutUser();
//   setIsLoggedIn(false);
//   navigate("/");
// }
