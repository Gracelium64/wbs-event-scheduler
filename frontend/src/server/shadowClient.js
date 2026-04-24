import { ShadowAppClient } from "@shadow-app/react-sdk";

const EVENTS_COLLECTION_NAME = "events";
let eventsCollectionIdCache = null;

export const shadowClient = new ShadowAppClient({
  baseURL: import.meta.env.VITE_SHADOW_APP_BASE_URL || "http://localhost:8080",
  onTokenRefresh: (token) => {
    localStorage.setItem("token", token);
    const user = parseUserFromToken(token);
    if (user?.id) {
      localStorage.setItem("userId", user.id);
    }
  },
  onAuthError: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  },
});

export function syncShadowClientToken() {
  const storedToken = localStorage.getItem("token");
  const currentToken = shadowClient.getAccessToken();

  if (!storedToken && currentToken) {
    shadowClient.clearTokens();
    return;
  }

  if (storedToken && storedToken !== currentToken) {
    shadowClient.setToken(storedToken);
  }
}

export function parseUserFromToken(token) {
  try {
    const normalizedToken = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    const [, payload] = normalizedToken.split(".");
    if (!payload) return null;

    // JWT payload uses base64url encoding, not plain base64.
    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    const decoded = JSON.parse(atob(base64));

    const userId = decoded?.id ?? decoded?.sub ?? decoded?.userId;
    if (!userId) return null;

    return {
      id: userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export async function ensureEventsCollection() {
  syncShadowClientToken();

  if (eventsCollectionIdCache) {
    return eventsCollectionIdCache;
  }

  const collections = await shadowClient.listCollections();
  const existingCollection = collections.find(
    (collection) => collection.name === EVENTS_COLLECTION_NAME,
  );

  if (existingCollection) {
    eventsCollectionIdCache = existingCollection.id;
    return eventsCollectionIdCache;
  }

  const createdCollection = await shadowClient.createCollection(
    EVENTS_COLLECTION_NAME,
  );

  eventsCollectionIdCache = createdCollection.id;
  return eventsCollectionIdCache;
}

// Restore session from localStorage on module load
const storedToken = localStorage.getItem("token");
if (storedToken) {
  shadowClient.setToken(storedToken);
  const user = parseUserFromToken(storedToken);
  if (user?.id) {
    localStorage.setItem("userId", user.id);
  }
}
