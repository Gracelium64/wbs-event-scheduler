import { logoutUser } from "../server/authFunctions";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";

const NavBar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/");
    logoutUser();
    setIsLoggedIn(false);
  }

  return (
    <>
      <div className="flex justify-end m-2">
        {isLoggedIn ? (
          <button className="border rounded p-1" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button
            className="border rounded p-1"
            onClick={() => navigate("/login")}
          >
            LOG IN
          </button>
        )}
      </div>
    </>
  );
};

export default NavBar;
