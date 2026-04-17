export function getToken() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");
  return token;
}
