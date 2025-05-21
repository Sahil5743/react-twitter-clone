import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="bg-[#15202b] border-b border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md"
      aria-label="Main navigation"
    >
      <Link
        to={user ? "/home" : "/"}
        className="text-xl font-bold text-blue-300 hover:text-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        MiniTwitter
      </Link>

      <ul className="flex items-center space-x-6 text-blue-300 font-medium">
        {!user ? (
          <>
            <li>
              <Link
                to="/login"
                className="hover:text-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="hover:text-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/home"
                className="hover:text-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${user.username}`}
                className="hover:text-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="hover:text-blue-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                aria-label="Notifications"
              >
                <span role="img" aria-hidden="true" className="mr-1">
                  🔔
                </span>
                Notifications
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-blue-400 text-black px-4 py-2 rounded-full hover:bg-blue-500 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
