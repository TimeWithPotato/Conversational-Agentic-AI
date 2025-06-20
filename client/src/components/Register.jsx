import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { useState } from "react";

const Register = () => {
  const { createUser } = useContext(AuthContext);
    const [weakPassword, setWeakPassword] = useState(false);
    const navigate = useNavigate();

  // Reference to the form
  const formRef = useRef();

  const handleRegister = (e) => {
    e.preventDefault();


    const [name, email, password] = e.target.elements;
    // console.log(name.value, email.value, password.value);

    //   console.log(password.value.length)

    if (password.value.length < 6) {
        setWeakPassword(true);
        return;
    }
        
    setWeakPassword(false);
    


      createUser(email.value, password.value)
        .then((userCredential) => {
        //   console.log("User created:", userCredential.user);
            formRef.current.reset();
            navigate("/interview")
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                alert("This email is already in use, try a different email");
            } else {
                alert("Error during Registration: ", + error.message);
            }
        });
  };

  return (
    <div className="hero bg-white min-h-screen">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-base-300">
            Create your account at here
          </h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
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
                  Password length should be greater than 6
                </span>
              )}
              <div>
                <p className="-mb-2 mt-3">Already have an account..!</p>
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
