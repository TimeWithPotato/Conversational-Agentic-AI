import { Link } from "react-router-dom";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { useContext } from "react";

const Home = () => {
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg max-w-lg w-full text-center p-10">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Welcome to Conversational Agentic AI
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Your personal AI interviewer. Ready to simulate real interviews based
          on your CV.
        </p>
        <Link
          to={isAuthenticated ? "/interview" : "/login"}
          className="inline-block px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-lg font-medium transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
