import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Debug from "./pages/Debug";
import History from "./pages/History";
import './index.css';

const isAuthenticated = () => !!localStorage.getItem("token");

const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const RedirectIfAuth = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/debug" /> : children;
};

function App() {
  // ✅ This will force dark mode across the app
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <Router>
        <Routes>
          <Route path="/login" element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          } />
          <Route path="/signup" element={
            <RedirectIfAuth>
              <Signup />
            </RedirectIfAuth>
          } />
          <Route path="/debug" element={
            <RequireAuth>
              <Debug />
            </RequireAuth>
          } />
          <Route path="/history" element={
            <RequireAuth>
              <History />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
