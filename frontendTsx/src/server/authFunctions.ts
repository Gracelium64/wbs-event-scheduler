import { getToken } from "./tokenFunction.js";
import { API_BASE_URL } from "./config.js";
import {
  UserSchema,
  LoginResponseSchema,
  type User,
} from "../schemas/index.js";
// import { useState } from "react";
import { z } from "zod/v4";

// const [error, setError] = useState<string | null>(null);
// const [loading, setLodaing] = useState(false);

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

  const resData = await response.json();
  const { data, error, success } = UserSchema.safeParse(resData);
  if (!success) throw new Error(z.prettifyError(error));
  return data;
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
  const resData = await response.json();
  const { data, error, success } = LoginResponseSchema.safeParse(resData);
  if (!success) throw new Error(z.prettifyError(error));
  return data;
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

  const resData = await response.json();
  const { data, error, success } = UserSchema.safeParse(resData);
  if (!success) throw new Error(z.prettifyError(error));
  return data;
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
