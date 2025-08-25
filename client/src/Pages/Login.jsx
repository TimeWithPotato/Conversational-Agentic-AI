import React, { useContext, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../ContextProvider/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);
  const formRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const [email, password] = e.target.elements;

    signIn(email.value, password.value)
      .then((userCredentials) => {
        console.log(userCredentials);
        formRef.current.reset();
        navigate("/interview");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          alert("Invalid email or password. Try again");
        } else {
          alert("Error in Login: " + error.message);
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 text-white px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold">Login</h1>
          <p className="mt-1 text-slate-300">Welcome back! Please login.</p>
        </div>
        <form onSubmit={handleLogin} ref={formRef}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?
            <Link
              to="/register"
              className="ml-2 text-blue-400 hover:text-white font-semibold transition"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
