import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [showDelayed, setShowDelayed] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayed(false); 
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || showDelayed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="loading loading-spinner text-blue-600 w-12 h-12"></span>
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;
