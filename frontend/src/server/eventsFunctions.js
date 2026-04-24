import {
  ensureEventsCollection,
  shadowClient,
  syncShadowClientToken,
} from "./shadowClient.js";

function normalizeEvent(document) {
  return {
    id: document.id,
    ownerId: document.ownerId,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    ...document.data,
  };
}

export async function addEvent({
  title,
  description,
  date,
  location,
  latitude,
  longitude,
  organizerId,
}) {
  syncShadowClientToken();

  if (!shadowClient.isAuthenticated()) {
    throw new Error("Please log in to add events");
  }

  const collectionId = await ensureEventsCollection();
  const document = await shadowClient.createDocument(collectionId, {
    data: {
      title,
      description,
      date,
      location,
      latitude,
      longitude,
      organizerId,
    },
  });

  return normalizeEvent(document);
}

export async function getAllEvents(page, limit) {
  syncShadowClientToken();

  if (!shadowClient.isAuthenticated()) {
    return {
      totalCount: 0,
      totalPages: 0,
      currentPage: page || 1,
      hasNextPage: false,
      hasPreviousPage: false,
      results: [],
    };
  }

  const collectionId = await ensureEventsCollection();
  const safeLimit = Number(limit) > 0 ? Number(limit) : 50;
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const offset = (safePage - 1) * safeLimit;

  const response = await shadowClient.listDocuments(collectionId, {
    limit: safeLimit,
    offset,
  });

  const totalCount = response.pagination?.count ?? response.data.length;
  const totalPages = Math.ceil(totalCount / safeLimit) || 1;

  return {
    totalCount,
    totalPages,
    currentPage: safePage,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
    results: response.data.map(normalizeEvent),
  };
}

export async function getEventById(id) {
  syncShadowClientToken();

  if (!shadowClient.isAuthenticated()) {
    throw new Error("Please log in to view this event");
  }

  const collectionId = await ensureEventsCollection();
  const event = await shadowClient.getDocument(collectionId, id);

  return normalizeEvent(event);
}

export async function updateEvent({
  id,
  title,
  description,
  date,
  location,
  organizerId,
}) {
  syncShadowClientToken();

  if (!shadowClient.isAuthenticated()) {
    throw new Error("Please log in to update events");
  }

  const collectionId = await ensureEventsCollection();
  const updatedDocument = await shadowClient.updateDocument(collectionId, id, {
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(date !== undefined ? { date } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(organizerId !== undefined ? { organizerId } : {}),
    },
  });

  return normalizeEvent(updatedDocument);
}

export async function deleteEvent({ id }) {
  syncShadowClientToken();

  if (!shadowClient.isAuthenticated()) {
    throw new Error("Please log in to delete events");
  }

  const collectionId = await ensureEventsCollection();
  await shadowClient.deleteDocument(collectionId, id);

  return true;
}

export async function getUpcomingEvents() {
  const eventsResponse = await getAllEvents(1, 200);
  const now = Date.now();

  return eventsResponse.results
    .filter((event) => {
      const timestamp = new Date(event.date).getTime();
      return !Number.isNaN(timestamp) && timestamp > now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}
