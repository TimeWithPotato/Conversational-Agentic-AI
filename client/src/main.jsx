import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VoiceToTextAndSpeak from "./pages/VoiceToTextAndSpeak.jsx";
import App from "./Layouts/App.jsx";
import Login from "./Pages/Login.jsx";
import Profile from "./Pages/Profile.jsx";
import Register from "./Pages/Register.jsx";
import AuthProvider from "./ContextProvider/AuthProvider.jsx";
import Home from "./Pages/Home.jsx";
import PrivateRoute from "./PrivateRoute/PrivateRoute.jsx";
import ResumeUpload from "./pages/ResumeUpload.jsx";
import ResumeProvider from "./ContextProvider/ResumeProvider.jsx";

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
        element: (
          <PrivateRoute>
            <VoiceToTextAndSpeak />
          </PrivateRoute>
        ),
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
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/ResumeUpload",
        element: (
          <PrivateRoute>
            <ResumeUpload />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ResumeProvider>
        <RouterProvider router={router} />
      </ResumeProvider>
    </AuthProvider>
  </StrictMode>
);
