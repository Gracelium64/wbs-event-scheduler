import { shadowClient } from "./shadowClient.js";

export async function registerUser({ email, password, name }) {
  const response = await shadowClient.signup({ email, password });
  const { id, email: userEmail, role } = response.data;
  localStorage.setItem(
    "user",
    JSON.stringify({ id, email: userEmail, role, name }),
  );
  return response;
}
// await registerUser({
//   email: "test@test.com",
//   password: "password",
//   name: "Jane Doe",
// });

export async function loginUser({ email, password }) {
  const response = await shadowClient.login({ email, password });
  const { id, email: userEmail, role } = response.data;
  localStorage.setItem("user", JSON.stringify({ id, email: userEmail, role }));
  return response;
}
// function handleLogIn({ email, password }) {
//   await loginUser({ email, password });
//   setIsLoggedIn(true);
//   navigate('/');
// }

export function getLoggedUser() {
  const user = localStorage.getItem("user");
  if (!user) throw new Error("No logged in user found");
  return JSON.parse(user);
}

// const loggedUser = getLoggedUser();

export function logoutUser() {
  shadowClient.logout();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// function handleLogout() {
//   logoutUser();
//   setIsLoggedIn(false);
//   navigate("/");
// }
