import { getToken } from "./tokenFunction.js";

export async function registerUser({ email, password, name }) {
  const response = await fetch("http://localhost:3001/api/users", {
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

export async function loginUser({ email, password }) {
  const response = await fetch("http://localhost:3001/api/auth/login", {
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

// const { token } = await loginUser({ email, password });
// localStorage.setItem("token", token);

export async function getLoggedUser() {
  const token = getToken();
  const response = await fetch("http://localhost:3001/api/auth/profile", {
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
}
