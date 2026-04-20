import { shadowClient } from "./shadowClient.js";

const USERS_COLLECTION = "users";

function isAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.role === "admin";
  } catch {
    return false;
  }
}

function sqlRowToUser(row) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: new Date(row.created_at * 1000).toISOString(),
    updatedAt: new Date(row.updated_at * 1000).toISOString(),
  };
}

export async function getAllUsers({ page, limit }) {
  const offset = (page - 1) * limit;

  if (isAdmin()) {
    const result = await shadowClient.executeAdminSql(
      `SELECT id, email, role, created_at, updated_at
       FROM users
       LIMIT ? OFFSET ?`,
      { params: [limit, offset] },
    );
    const rows = result.data[0]?.rows ?? [];
    return {
      success: result.success,
      data: rows.map(sqlRowToUser),
      pagination: { limit, offset, count: rows.length },
    };
  }

  return shadowClient.listDocuments(USERS_COLLECTION, { limit, offset });
}

// const users = await getAllUsers({ page: 1, limit: 10 });

export async function getUserById(id) {
  if (isAdmin()) {
    const result = await shadowClient.executeAdminSql(
      `SELECT id, email, role, created_at, updated_at FROM users WHERE id = ?`,
      { params: [id] },
    );
    const row = result.data[0]?.rows[0];
    if (!row) throw new Error("User not found");
    return sqlRowToUser(row);
  }

  return shadowClient.getDocument(USERS_COLLECTION, id);
}

// const user = await getUserById(id);

export async function updateUser({ id, email, password, name }) {
  // Password is excluded from the SQL path: updating it via raw SQL would
  // bypass the server's bcrypt hashing. Route through the document API instead.
  if (isAdmin() && !password) {
    const now = Math.floor(Date.now() / 1000);
    await shadowClient.executeAdminSql(
      `UPDATE users SET email = ?, updated_at = ? WHERE id = ?`,
      { params: [email, now, id] },
    );
    return getUserById(id);
  }

  return shadowClient.updateDocument(USERS_COLLECTION, id, {
    data: { email, password, name },
  });
}

// await updateUser({ id, email, password, name });

export async function deleteUser({ id }) {
  if (isAdmin()) {
    await shadowClient.executeAdminSql(`DELETE FROM users WHERE id = ?`, {
      params: [id],
    });
    return true;
  }

  await shadowClient.deleteDocument(USERS_COLLECTION, id);
  return true;
}

// await deleteUser({ id });
