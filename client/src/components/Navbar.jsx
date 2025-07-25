import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, Logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAuthenticated = !!user;
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await Logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { path: "/", name: "Home" },
    ...(isAuthenticated
      ? [
          { path: "/profile", name: "Profile" },
          { path: "/interview", name: "Interview" },
          { path: "/ResumeUpload", name: "Upload Resume" },
          { path: "/evaluation", name: "Evaluation" },
        ]
      : [
          { path: "/login", name: "Login" },
          { path: "/register", name: "Create Account" },
        ]),
  ];

  return (
    <nav className="bg-gray-900 px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-white text-2xl font-extrabold tracking-wide select-none">
          AI Interviewer App
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="text-white md:hidden focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
          onClick={() => setShowMenu((prev) => !prev)}
          type="button"
        >
          {showMenu ? (
            <X size={28} className="transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95" />
          ) : (
            <Menu size={28} className="transition-transform duration-300 ease-in-out hover:scale-110 active:scale-95" />
          )}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `text-lg font-semibold tracking-wide transition transform duration-200 ${
                  isActive
                    ? "text-yellow-400 scale-110"
                    : "text-white hover:text-yellow-400 hover:scale-105 active:scale-95"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-white font-semibold tracking-wide px-3 py-1 rounded-md hover:text-yellow-400 hover:scale-105 active:scale-95 transition transform duration-200 shadow-sm shadow-yellow-500/50"
              type="button"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu with smooth transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          showMenu ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 bg-gray-800 rounded-lg p-4 shadow-lg">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `text-base font-semibold tracking-wide transition transform duration-200 rounded-md px-3 py-2 ${
                  isActive
                    ? "text-yellow-400 bg-yellow-900 scale-105"
                    : "text-white hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95"
                }`
              }
              tabIndex={showMenu ? 0 : -1}
            >
              {item.name}
            </NavLink>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setShowMenu(false);
              }}
              className="text-white font-semibold tracking-wide px-3 py-2 rounded-md hover:text-yellow-400 hover:bg-yellow-900 hover:scale-105 active:scale-95 transition transform duration-200 shadow-sm shadow-yellow-500/50"
              type="button"
              tabIndex={showMenu ? 0 : -1}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
