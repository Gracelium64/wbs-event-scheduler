import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Home, About, NotFound, Register, CreateEvent, LogIn } from "./pages";
import { Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { ShadowAppProvider } from "@shadow-app/react-sdk";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <ShadowAppProvider
        config={{
          baseURL:
            import.meta.env.VITE_SHADOW_APP_BASE_URL || "http://localhost:8080",
          onTokenRefresh: (token) => {
            localStorage.setItem("token", token);
          },
          onAuthError: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          },
        }}
      >
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<LogIn />} />
                <Route path="register" element={<Register />} />
                <Route path="about" element={<About />} />
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
      </ShadowAppProvider>
    </>
  );
}

export default App;

//todo: create event component (backend expects ISO date string like: 2026-04-16T14:30:00.000Z)
