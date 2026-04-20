import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Home, About, NotFound, Register, CreteEvent, LogIn } from "./pages";
import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";

const ProtectedRoute = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          >
            <Route index element={<Home />} />
            <Route
              path="login"
              element={<LogIn setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
              <Route path="createEvent" element={<CreteEvent />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

//todo: login page
//todo: register page
//todo: create event component (backend expects ISO date string like: 2026-04-16T14:30:00.000Z)
