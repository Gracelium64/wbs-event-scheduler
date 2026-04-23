import { Outlet } from "react-router-dom";
import { NavBar, Footer } from "../components";

const MainLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-1 px-10 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
