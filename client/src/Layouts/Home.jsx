import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-md p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Conversational Agentic AI</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your personal AI interviewer. Ready to simulate real interviews based on your CV.
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;
