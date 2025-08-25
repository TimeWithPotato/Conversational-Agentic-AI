import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../ContextProvider/AuthProvider";

const Register = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [weakPassword, setWeakPassword] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef();

  const handleRegister = (e) => {
    e.preventDefault();
    const [name, email, password] = e.target.elements;

    if (password.value.length < 6) {
      setWeakPassword(true);
      return;
    }

    setWeakPassword(false);

    createUser(email.value, password.value)
      .then(() => updateUserProfile({ displayName: name.value }))
      .then(() => {
        formRef.current.reset();
        navigate("/interview");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("This email is already in use, try a different email");
        } else {
          alert("Error during Registration: " + error.message);
        }
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl p-8 border border-slate-600">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6">
          Create Your Account
        </h1>
        <form className="space-y-5" onSubmit={handleRegister} ref={formRef}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="password"
              required
            />
            {weakPassword && (
              <p className="text-red-400 text-sm mt-1">
                Password must be at least 6 characters long.
              </p>
            )}
          </div>
          <div className="text-sm text-slate-300 mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
            >
              Login
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
