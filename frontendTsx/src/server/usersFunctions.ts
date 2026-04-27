import { getToken } from "./tokenFunction.js";
import { API_BASE_URL } from "./config.js";
import type { User } from "../interfaces/index.js";

export async function getAllUsers(page: number, limit: number) {
  const response = await fetch(
    `${API_BASE_URL}/users?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Nope. Nope nope nope");
  }

  return response.json();
}

// const users = await getAllUsers({ page: 1, limit: 10 });

export async function getUserById(id: User) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No user found");
  }

  return response.json();
}

// const user = await getUserById(id);

export async function updateUser({ id, email, password, name }: User) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Updating user details failed");
  }

  return response.json();
}

// await updateUser({ id, email, password, name });

export async function deleteUser(id: User) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "User deletion failed");
  }

  return true;
}

// await deleteUser({ id });
