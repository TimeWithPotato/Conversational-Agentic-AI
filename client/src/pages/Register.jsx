import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

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
      .then(() => {
        return updateUserProfile({ displayName: name.value });
      })
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
    <div className="hero bg-white min-h-screen">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-base-300">
            Create your account here
          </h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form className="card-body" onSubmit={handleRegister} ref={formRef}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered"
                name="name"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                name="email"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                name="password"
                required
              />
              {weakPassword && (
                <span className="text-red-600">
                  Password length should be at least 6 characters
                </span>
              )}
              <div>
                <p className="-mb-2 mt-3">Already have an account?</p>
                <label className="label">
                  <Link
                    to="/login"
                    className="bg-slate-500 px-3 py-1 rounded text-sm text-white hover:bg-slate-700 hover:scale-105 transform transition duration-300 font-semibold shadow-md"
                  >
                    Login
                  </Link>
                </label>
              </div>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
