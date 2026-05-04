import { getToken } from "./tokenFunction.js";
import { API_BASE_URL } from "./config.js";
import {
  PaginatedUsersSchema,
  UserSchema,
  type User,
} from "../schemas/index.js";
import { z } from "zod/v4";

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

  const resData = await response.json();
  const { data, error, success } = PaginatedUsersSchema.safeParse(resData);
  if (!success) throw new Error(z.prettifyError(error));
  return data;
}

// const users = await getAllUsers({ page: 1, limit: 10 });

export async function getUserById(id: number | string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No user found");
  }

  const resData = await response.json();
  const { data, error, success } = UserSchema.safeParse(resData);
  if (!success) throw new Error(z.prettifyError(error));
  return data;
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

  const resData = await response.json();
  const { data, error, success } = UserSchema.safeParse(resData);
  if (!success) throw new Error(z.prettifyError(error));
  return data;
}

// await updateUser({ id, email, password, name });

export async function deleteUser(id: number | string) {
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
