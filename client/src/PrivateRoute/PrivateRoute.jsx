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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white backdrop-blur-md">
      <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

  if (user) {
    return children;
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;
