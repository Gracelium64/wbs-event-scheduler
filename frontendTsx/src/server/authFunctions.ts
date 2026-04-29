import { getToken } from "./tokenFunction.js";
import { API_BASE_URL } from "./config.js";
import type { User } from "../interfaces/index.js";

export async function registerUser({ email, password, name }: User) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}
// await registerUser({
//   email: "test@test.com",
//   password: "password",
//   name: "Jane Doe",
// });

export async function loginUser({ email, password }: User) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message ||
        "User or password don't match (have fun figuring which one out)",
    );
  }

  return response.json();
}
// function handleLogIn({ email, password }) {
//   const { token } = await loginUser({ email, password });
//   localStorage.setItem("token", token);
//   setIsLoggedIn(true);
//   navigate('/');
// }

export async function getLoggedUser() {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No logged in user found");
  }

  return response.json();
}

// const loggedUser = await getLoggedUser();

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

// function handleLogout() {
//   logoutUser();
//   setIsLoggedIn(false);
//   navigate("/");
// }
