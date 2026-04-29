// The backend expects an ISO date string like:
// 2026-04-16T14:30:00.000Z

import { getToken } from "./tokenFunction.js";
import { API_BASE_URL } from "./config.js";
import type {
  CreateEventPayload,
  UpdateEventPayload,
} from "../interfaces/index.js";

export async function addEvent({
  title,
  description,
  date,
  location,
  organizerId,
}: CreateEventPayload) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      date,
      location,
      organizerId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add an event");
  }

  return response.json();
}

// await addEvent({ title, description, date, location });

export async function getAllEvents(page: number, limit: number) {
  let query = "";

  if (page) {
    query = `?page=${page}&`;
  }
  if (limit) {
    if (!query) {
      query = "?";
    }
    query += `limit=${limit}`;
  }

  const response = await fetch(`${API_BASE_URL}/events${query}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No events found");
  }

  return response.json();
}

// const events = await getAllEvents({ page, limit });

export async function getEventById(id: number | string) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Event not found");
  }

  return response.json();
}

// const event = await getEventById(id);

export async function updateEvent({
  title,
  description,
  date,
  location,
  organizerId,
  id,
}: UpdateEventPayload) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      date,
      location,
      organizerId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update event");
  }

  return response.json();
}

// await updateEvent({ id, title, description, date, location })

export async function deleteEvent(id: number | string) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete event");
  }

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
