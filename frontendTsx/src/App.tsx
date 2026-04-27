import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import {
  Home,
  // About,
  NotFound,
  Register,
  CreateEvent,
  LogIn,
  // EventPage,
} from "./pages";
import { Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<LogIn />} />
              <Route path="register" element={<Register />} />
              {/* <Route path="about" element={<About />} /> */}
              <Route
                path="events/:eventId"
                // element={<EventPage mode="view" />}
              />
              <Route path="*" element={<NotFound />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="createEvent"
                  element={<CreateEvent mode="create" />}
                />
                <Route
                  path="events/:id/edit"
                  element={<CreateEvent mode="edit" />}
                />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
