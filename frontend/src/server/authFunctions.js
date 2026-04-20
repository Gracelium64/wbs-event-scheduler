import { getToken } from "./tokenFunction.js";
import { API_BASE_URL } from "./config.js";

export async function registerUser({ email, password, name }) {
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

export async function loginUser({ email, password }) {
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
// function handleLogIn() {
//   const { token } = await loginUser({ email, password });
//   localStorage.setItem("token", token);
//   setIsLoggedIn(true);
//   navigate('/home');
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
}

// function handleLogout() {
//   logoutUser();
//   setIsLoggedIn(false);
//   navigate("/");
// }
