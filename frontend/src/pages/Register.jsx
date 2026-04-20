import { useNavigate } from "react-router";
import { registerUser } from "../server/authFunctions";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    let valid = true;
    if (!email) {
      setEmailError("Email is required");

      valid = false;
    } else {
      setEmailError("");
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!name) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError("");
    }

    if (!valid) return;

    try {
      await registerUser({ email, password, name });
      navigate("/login");
    } catch (error) {
      setServerError(error.message);
    }
  }

  return (
    <>
      <div
        className={`border rounded max-w-sm m-20 mx-auto ${emailError && passwordError && nameError ? "border-red-600" : ""}`}
      >
        <form
          onSubmit={handleRegister}
          className="rounded-xl p-6 flex flex-col items-center justify-center gap-2"
        >
          <div className="flex flex-col">
            {" "}
            <div className="flex flex-row ">
              <label className="block mb-4 mt-2">Name: </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mb-1 p-2 rounded border ml-10 ${nameError ? "border-red-500" : ""}`}
              />
            </div>
            {nameError && (
              <p className="text-red-400 text-xs ml-2 mb-2">{emailError}</p>
            )}
          </div>

          <div className="flex flex-col">
            {" "}
            <div className="flex flex-row ">
              <label className="block mb-4 mt-2">Email: </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mb-1 p-2 rounded border ml-10 ${emailError ? "border-red-500" : ""}`}
              />
            </div>
            {emailError && (
              <p className="text-red-400 text-xs ml-2 mb-2">{emailError}</p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <label className="block mb-4 mt-2">Password: </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mb-1 p-2 rounded border ml-2 ${passwordError ? "border-red-500" : ""}`}
              />
            </div>
            {passwordError && (
              <p className="text-red-400 text-xs ml-2 mb-2">{passwordError}</p>
            )}
          </div>
          {serverError && (
            <p className="text-red-400 text-sm text-center mb-2">
              {serverError}
            </p>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded border mt-4  hover:bg-purple-900 transition-colors duration-300 ease-in-out"
          >
            Register
          </button>
        </form>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 p-4">
        <h1 className="m-4">Got lost on the way to the fridge?</h1>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 border rounded  p-1 hover:bg-purple-900 transition-colors duration-300 ease-in-out"
        >
          Log In
        </button>
      </div>
    </>
  );
};

export default Register;
