import { Outlet } from "react-router-dom";
import { NavBar, Footer } from "../components";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
      <NavBar />
      <main className="flex-1 px-10 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
