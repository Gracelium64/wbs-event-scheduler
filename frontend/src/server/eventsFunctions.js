// The backend expects an ISO date string like:
// 2026-04-16T14:30:00.000Z

export async function addEvent({ title, description, date, location, token }) {
  const response = await fetch("http://localhost:3001/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, date, location }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add an event");
  }

  return response.json();
}

// await addEvent({ title, description, date, location, token });

export async function getAllEvents({ page, limit }) {
  const response = await fetch(
    `http://localhost:3001/api/events?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No events found");
  }

  return response.json();
}

// const events = await getAllEvents({ page, limit });

export async function getEventById(id) {
  const response = await fetch(`http://localhost:3001/api/events/${id}`, {
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
  id,
  title,
  description,
  date,
  location,
  token,
}) {
  const response = await fetch(`http://localhost:3001/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, date, location }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update event");
  }

  return response.json();
}

// await updateEvent({ id, title, description, date, location, token})

export async function deleteEvent({ id, token }) {
  const response = await fetch(`http://localhost:3001/api/events/${id}`, {
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

// await deleteEvent({ id, token });

export async function getUpcomingEvents() {
  const response = await fetch("http://localhost:3001/api/events/upcoming", {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to retrieve upcoming events");
  }

  return response.json();
}

// const upcomingEvents = await getUpcomingEvents();
