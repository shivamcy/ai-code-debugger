import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bug, Moon, Sun, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-6 py-4 shadow-md flex items-center justify-between font-semibold tracking-wide`}
    >
      {/* Left - Logo & Links */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-green-500 text-xl font-bold"
        >
          <Bug className="w-6 h-6" />
          AI-CodeDebugger
        </Link>
        <Link
          to="/debug"
          className="hover:text-green-500 transition duration-200"
        >
          Debug
        </Link>
        <Link
          to="/history"
          className="hover:text-green-500 transition duration-200"
        >
          History
        </Link>
      </div>

      {/* Right - Toggle + Logout */}
      <div className="flex items-center space-x-4">
        {/* Optional Dark Mode Toggle */}
        {/* <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button> */}

        {/* Logout Button with Icon */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md transition font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
