import { logoutUser } from "../server/authFunctions";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";

const NavBar = () => {
  const auth = useAuth();
  if (!auth) throw new Error("useAuth error NavBar.tsx");
  const { isLoggedIn, setIsLoggedIn } = auth;
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/");
    logoutUser();
    setIsLoggedIn(false);
  }

  return (
    <>
      <div className="flex flex-row">
        <div className="flex m-2">
          <button
            type="button"
            className="btn btn-ghost px-4 py-2 rounded border mt-4  hover:bg-primary transition-colors duration-300 ease-in-out"
            onClick={() => navigate("/")}
          >
            Home Page
          </button>
        </div>
        <div className="flex m-2">
          <button
            type="button"
            className="btn btn-ghost px-4 py-2 rounded border mt-4  hover:bg-secondary transition-colors duration-300 ease-in-out"
            onClick={() => navigate("/createEvent")}
          >
            Add Event
          </button>
        </div>
        <div className="flex ml-auto m-2 ">
          {isLoggedIn ? (
            <button
              type="button"
              className="btn btn-ghost px-4 py-2 rounded border mt-4  hover:bg-error transition-colors duration-300 ease-in-out"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost px-4 py-2 rounded border mt-4  hover:bg-purple-900 transition-colors duration-300 ease-in-out"
              onClick={() => navigate("/login")}
            >
              LOG IN
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
