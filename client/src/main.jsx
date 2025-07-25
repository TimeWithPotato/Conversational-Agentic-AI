import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./Layouts/App.jsx";
import Login from "./Pages/Login.jsx";
import Profile from "./Pages/Profile.jsx";
import Register from "./Pages/Register.jsx";
import AuthProvider from "./ContextProvider/AuthProvider.jsx";
import Home from "./Pages/Home.jsx";
import PrivateRoute from "./PrivateRoute/PrivateRoute.jsx";
import ResumeUpload from "./Pages/ResumeUpload.jsx";
import ResumeProvider from "./ContextProvider/ResumeProvider.jsx";
import MinimalSpeechApp from "./Pages/Minimal.jsx";
import ChatHistoryProvider from "./ContextProvider/ChatHistoryProvider.jsx";
import ParentInterViewContainer from "./Layouts/ParentInterViewContainer.jsx";
import Evaluation from "./Pages/Evaluation.jsx";
import QnaHistoryProvider from "./ContextProvider/QnaHistoryProvider.jsx";
import EvaluationProvider from "./ContextProvider/EvaluationProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/minimal",
    element: <MinimalSpeechApp />,
  },
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
            <ParentInterViewContainer />
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
      {
        path: "/evaluation",
        element: (
          <PrivateRoute>
            <Evaluation />
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
        <ChatHistoryProvider>
          <QnaHistoryProvider>
            <EvaluationProvider>
              <RouterProvider router={router} />
            </EvaluationProvider>
          </QnaHistoryProvider>
        </ChatHistoryProvider>
      </ResumeProvider>
    </AuthProvider>
  </StrictMode>
);
