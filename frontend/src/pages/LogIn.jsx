import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../server/authFunctions";
import { useState } from "react";

const LogIn = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogIn(e) {
    e.preventDefault();
    setIsLoading(true);
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

    if (!valid) return;

    try {
      const {
        token,
        user: { id, validatedEmail },
      } = await loginUser({ email, password });
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      localStorage.setItem("validatedEmail", validatedEmail);
      setIsLoggedIn(true);
      navigate("/");
    } catch {
      setServerError(
        "User or password don't match (have fun figuring which one out)",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div
        className={`card shadow-2xl max-w-sm m-20 mx-auto ${emailError && passwordError ? "border-red-600" : ""}`}
      >
        <form
          onSubmit={handleLogIn}
          className="rounded-xl p-6 flex flex-col items-center justify-center gap-2"
        >
          <div className="flex flex-col">
            {" "}
            <div className="flex flex-row ">
              <label className="block mb-4 mt-2">Email: </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input mb-1 p-2  ml-10 ${emailError ? "border-red-500" : ""}`}
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
                className={`input mb-1 p-2 rounded border ml-2 ${passwordError ? "border-red-500" : ""}`}
              />
            </div>
            {passwordError && (
              <p className="text-red-400 text-xs ml-2 mb-2">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-ghost px-4 py-2 rounded border mt-4  hover:bg-purple-900 transition-colors duration-300 ease-in-out"
          >
            {isLoading ? (
              <span className="loading loading-infinity loading-xl"></span>
            ) : (
              "Log In"
            )}
          </button>
          {serverError && (
            <p className="text-red-400 text-sm text-center mb-2">
              {serverError}
            </p>
          )}
        </form>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 p-4">
        <h1 className="m-4">No user yet?</h1>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="btn btn-ghost px-4 py-2 border rounded  p-1 hover:bg-purple-900 transition-colors duration-300 ease-in-out"
        >
          Register
        </button>
      </div>
    </>
  );
};

export default LogIn;
