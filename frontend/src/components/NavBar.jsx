import { useShadowApp, useAuth as useShadowAuth } from '@shadow-app/react-sdk';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth';

const NavBar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { client } = useShadowApp();
  const { logout } = useShadowAuth(client);

  function handleLogout() {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  }

  return (
    <>
      <div className="flex flex-row">
        <div className="flex m-2">
          <button
            type="button"
            className="btn btn-ghost px-4 py-2 rounded border mt-4  hover:bg-primary transition-colors duration-300 ease-in-out"
            onClick={() => navigate('/')}
          >
            Home Page
          </button>
        </div>
        <div className="flex m-2">
          <button
            type="button"
            className="btn btn-ghost px-4 py-2 rounded border mt-4  hover:bg-secondary transition-colors duration-300 ease-in-out"
            onClick={() => navigate('/createEvent')}
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
              onClick={() => navigate('/login')}
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
