import {
  parseUserFromToken,
  shadowClient,
  syncShadowClientToken,
} from "./shadowClient.js";

export async function registerUser({ email, password, name }) {
  const response = await shadowClient.signup({ email, password });
  const token = response?.data?.token;

  if (!token) {
    throw new Error("Registration failed");
  }

  const user = parseUserFromToken(token);
  if (user?.id) {
    localStorage.setItem("userId", user.id);
  }

  return {
    ...response,
    data: {
      ...response.data,
      name,
    },
  };
}

export async function loginUser({ email, password }) {
  const response = await shadowClient.login({ email, password });
  const token = response?.data?.token;

  if (!token) {
    throw new Error("User or password don't match");
  }

  const user = parseUserFromToken(token);
  if (user?.id) {
    localStorage.setItem("userId", user.id);
  }

  return response;
}

export async function getLoggedUser() {
  syncShadowClientToken();

  const token = shadowClient.getAccessToken();
  if (!token) {
    throw new Error("No logged in user found");
  }

  const user = parseUserFromToken(token);
  if (!user?.id) {
    const persistedUserId = localStorage.getItem("userId");
    if (persistedUserId) {
      return { id: persistedUserId };
    }

    throw new Error("Could not determine logged user from token");
  }

  return user;
}

export function logoutUser() {
  shadowClient.logout();
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
}
