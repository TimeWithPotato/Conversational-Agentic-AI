import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const App = () => {
  const navItems = [
    { path: "/login", name: "Login" },
    { path: "/logout", name: "Logout" },
    { path: "/profile", name: "Profile" },
    { path: "/", name: "Give Interview" },
  ];

  return (
    <div>
      <nav className="bg-gray-800 px-6 py-4 flex gap-6">
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
      </nav>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
