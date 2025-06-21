import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);
  const formRef = useRef(null);

  const handleLogin = e => {
    e.preventDefault();
    const [email, password] = e.target.elements;
    // console.log(email.value, password.value);

    signIn(email.value, password.value)
      .then((userCredentials) => {
        console.log(userCredentials)
        formRef.current.reset();
        navigate('/interview')
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          alert('Invalid email or password. Try again');
        }
        else {
          alert('Error in Login: ' + error.message);
        }
    })

    
  }

  return (
    <div className="hero bg-white min-h-screen">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-base-300">Login now!</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleLogin} ref={formRef}>
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
                            <div>
                <p className="-mb-2 mt-3">Don't have an account..!</p>
                <label className="label">
                  <Link
                    to="/register"
                    className="bg-slate-500 px-3 py-1 rounded text-sm text-white hover:bg-slate-700 hover:text-white hover:scale-105 transform transition duration-300 font-semibold shadow-md w-"
                  >
                    Create New Account
                  </Link>
                </label>
              </div>
              {/* <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label> */}
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
