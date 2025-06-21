import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../ContextProvider/AuthProvider";

const Navbar = () => {
  const { user, Logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAuthenticated = !!user;

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
        ]
      : [
          { path: "/login", name: "Login" },
          { path: "/register", name: "Create Account" },
        ]),
  ];

  return (
    <nav className="bg-gray-800 px-6 py-4 flex gap-6 items-center">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `text-lg font-medium transition-colors ${
              isActive ? "text-yellow-300" : "text-white hover:text-yellow-200"
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="text-white text-lg font-medium hover:text-yellow-200 transition"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
