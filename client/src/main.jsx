import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VoiceToTextAndSpeak from "./pages/VoiceToTextAndSpeak.jsx";
import App from "./Layouts/App.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import AuthProvider from "./provider/AuthProvider.jsx";
import Home from "./pages/Home.jsx";
import PrivateRoute from "./PrivateRoute/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/interview",
        element: <PrivateRoute><VoiceToTextAndSpeak /></PrivateRoute>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <PrivateRoute><Profile /></PrivateRoute>,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
