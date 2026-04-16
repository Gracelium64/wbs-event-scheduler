export async function getAllUsers({ page, limit }) {
  const response = await fetch(
    `http://localhost:3001/api/users?page=${page}&limit=${limit}`,
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

export async function getUserById(id) {
  const response = await fetch(`http://localhost:3001/api/users/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No user found");
  }

  return response.json();
}

// const user = await getUserById(id);

export async function updateUser({ id, email, password, name, token }) {
  const response = await fetch(`http://localhost:3001/api/users/${id}`, {
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

// await updateUser({ id, email, password, name, token });

export async function deleteUser({ id, token }) {
  const response = await fetch(`http://localhost:3001/api/users/${id}`, {
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

// await deleteUser({ id, token });
