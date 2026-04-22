// The backend expects an ISO date string like:
// 2026-04-16T14:30:00.000Z

import { API_BASE_URL } from "./config.js";

const EVENTS_COLLECTION_NAME =
  import.meta.env.VITE_EVENTS_COLLECTION_NAME || "events";
const EVENTS_COLLECTION_ID = import.meta.env.VITE_EVENTS_COLLECTION_ID || null;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Cache collection IDs by name to avoid repeated lookups
const collectionIdCache = {};

async function getCollectionId(name) {
  if (EVENTS_COLLECTION_ID) {
    collectionIdCache[name] = EVENTS_COLLECTION_ID;
    return EVENTS_COLLECTION_ID;
  }

  if (collectionIdCache[name]) return collectionIdCache[name];

  const response = await fetch(`${API_BASE_URL}/collections`, {
    headers: authHeaders(),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Failed to fetch collections");
  }

  const collections = Array.isArray(body.data) ? body.data : [];
  for (const col of collections) {
    if (col?.name && col?.id) {
      collectionIdCache[col.name] = col.id;
    }
  }

  const normalizedName = String(name).trim().toLowerCase();
  const matched = collections.find(
    (col) =>
      String(col?.name || "")
        .trim()
        .toLowerCase() === normalizedName,
  );
  if (matched?.id) {
    collectionIdCache[name] = matched.id;
    return matched.id;
  }

  if (!collectionIdCache[name]) {
    // Create the collection for the current user if it does not exist in their scope.
    const createResponse = await fetch(`${API_BASE_URL}/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ name }),
    });
    const createBody = await createResponse.json().catch(() => ({}));
    if (createResponse.ok && createBody.success && createBody.data?.id) {
      collectionIdCache[name] = createBody.data.id;
      return createBody.data.id;
    }

    const visibleNames = collections.map((col) => col?.name).filter(Boolean);
    throw new Error(
      createBody.error ||
        `Collection "${name}" not found for this user. Visible collections: ${visibleNames.join(", ") || "none"}`,
    );
  }

  return collectionIdCache[name];
}

export async function addEvent({ title, description, date, location }) {
  const collectionId = await getCollectionId(EVENTS_COLLECTION_NAME);
  const response = await fetch(
    `${API_BASE_URL}/collections/${collectionId}/documents`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ title, description, date, location }),
    },
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Failed to create event");
  }
  return body.data;
}

// await addEvent({ title, description, date, location });

export async function getAllEvents({ page = 1, limit = 10 } = {}) {
  const collectionId = await getCollectionId(EVENTS_COLLECTION_NAME);
  const offset = (page - 1) * limit;
  const response = await fetch(
    `${API_BASE_URL}/collections/${collectionId}/documents?limit=${limit}&offset=${offset}`,
    { headers: authHeaders() },
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Failed to fetch events");
  }
  return body;
}

// const events = await getAllEvents({ page: 1, limit: 10 });

export async function getUpcomingEvents() {
  const collectionId = await getCollectionId(EVENTS_COLLECTION_NAME);
  // Shadow App has no date-filter endpoint — fetch and filter client-side
  const response = await fetch(
    `${API_BASE_URL}/collections/${collectionId}/documents?limit=100&offset=0`,
    { headers: authHeaders() },
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Failed to fetch upcoming events");
  }
  const now = new Date();
  return body.data
    .filter((doc) => new Date(doc.data.date) > now)
    .sort((a, b) => new Date(a.data.date) - new Date(b.data.date));
}

// const upcomingEvents = await getUpcomingEvents();

export async function getEventById(id) {
  const collectionId = await getCollectionId(EVENTS_COLLECTION_NAME);
  const response = await fetch(
    `${API_BASE_URL}/collections/${collectionId}/documents/${id}`,
    { headers: authHeaders() },
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Event not found");
  }
  return body.data;
}

// const event = await getEventById(id);

export async function updateEvent({ id, title, description, date, location }) {
  const collectionId = await getCollectionId(EVENTS_COLLECTION_NAME);
  const response = await fetch(
    `${API_BASE_URL}/collections/${collectionId}/documents/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ title, description, date, location }),
    },
  );
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.success) {
    throw new Error(body.error ?? "Failed to update event");
  }
  return body.data;
}

// await updateEvent({ id, title, description, date, location });

export async function deleteEvent({ id }) {
  const collectionId = await getCollectionId(EVENTS_COLLECTION_NAME);
  const response = await fetch(
    `${API_BASE_URL}/collections/${collectionId}/documents/${id}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to delete event");
  }
  return true;
}

// await deleteEvent({ id });
