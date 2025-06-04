import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VoiceToTextAndSpeak from "./components/VoiceToTextAndSpeak.jsx";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Profile from "./components/Profile.jsx";

const router =
  createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element:<VoiceToTextAndSpeak />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/logout",
          element: <Logout />
        },
        {
          path: "/profile",
          element: <Profile />
        }
      ]
    }
  ]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
