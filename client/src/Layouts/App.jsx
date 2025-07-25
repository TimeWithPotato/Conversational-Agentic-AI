import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};


export default App;
