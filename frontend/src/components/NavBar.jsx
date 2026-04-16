import { logoutUser } from "../server/authFunctions";

const NavBar = () => {
  return (
    <>
      <div className="flex justify-end m-2">
        <button className="border rounded p-1" onClick={logoutUser}>
          LOGOUT
        </button>
      </div>
    </>
  );
};

export default NavBar;
