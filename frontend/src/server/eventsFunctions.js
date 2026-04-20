// The backend expects an ISO date string like:
// 2026-04-16T14:30:00.000Z

import { shadowClient } from "./shadowClient.js";

const EVENTS_COLLECTION = "events";

function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.role === "admin";
  } catch {
    return false;
  }
}

function sqlRowToDocument(row) {
  return {
    id: row.id,
    collectionId: row.collection_id,
    ownerId: row.owner_id,
    data: typeof row.data === "string" ? JSON.parse(row.data) : row.data,
    createdAt: new Date(row.created_at * 1000).toISOString(),
    updatedAt: new Date(row.updated_at * 1000).toISOString(),
  };
}

export async function addEvent({ title, description, date, location }) {
  // Document API used for create regardless of role:
  // SQL INSERT requires a collection UUID lookup which the SDK handles internally.
  return shadowClient.createDocument(EVENTS_COLLECTION, {
    data: { title, description, date, location },
  });
}

// await addEvent({ title, description, date, location });

export async function getAllEvents({ page, limit }) {
  const offset = (page - 1) * limit;

  if (isAdmin()) {
    const result = await shadowClient.executeAdminSql(
      `SELECT d.id, d.collection_id, d.owner_id, d.data, d.created_at, d.updated_at
       FROM documents d
       JOIN collections c ON d.collection_id = c.id
       WHERE c.name = ?
       LIMIT ? OFFSET ?`,
      { params: [EVENTS_COLLECTION, limit, offset] },
    );
    const rows = result.data[0]?.rows ?? [];
    return {
      success: result.success,
      data: rows.map(sqlRowToDocument),
      pagination: { limit, offset, count: rows.length },
    };
  }

  return shadowClient.listDocuments(EVENTS_COLLECTION, { limit, offset });
}

// const events = await getAllEvents({ page, limit });

export async function getEventById(id) {
  if (isAdmin()) {
    const result = await shadowClient.executeAdminSql(
      `SELECT d.id, d.collection_id, d.owner_id, d.data, d.created_at, d.updated_at
       FROM documents d
       WHERE d.id = ?`,
      { params: [id] },
    );
    const row = result.data[0]?.rows[0];
    if (!row) throw new Error("Event not found");
    return sqlRowToDocument(row);
  }

  return shadowClient.getDocument(EVENTS_COLLECTION, id);
}

// const event = await getEventById(id);

export async function updateEvent({ id, title, description, date, location }) {
  if (isAdmin()) {
    const now = Math.floor(Date.now() / 1000);
    await shadowClient.executeAdminSql(
      `UPDATE documents SET data = ?, updated_at = ? WHERE id = ?`,
      {
        params: [
          JSON.stringify({ title, description, date, location }),
          now,
          id,
        ],
      },
    );
    return getEventById(id);
  }

  return shadowClient.updateDocument(EVENTS_COLLECTION, id, {
    data: { title, description, date, location },
  });
}

// await updateEvent({ id, title, description, date, location })

export async function deleteEvent({ id }) {
  if (isAdmin()) {
    await shadowClient.executeAdminSql(`DELETE FROM documents WHERE id = ?`, {
      params: [id],
    });
    return true;
  }

  await shadowClient.deleteDocument(EVENTS_COLLECTION, id);
  return true;
}

// await deleteEvent({ id });

export async function getUpcomingEvents() {
  const response = await fetch(`${API_BASE_URL}/events/upcoming`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to retrieve upcoming events");
  }

  return response.json();
}

// const upcomingEvents = await getUpcomingEvents();
