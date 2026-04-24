import React from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import logo from "../assets/splendid.png";

const Register = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { firstName, lastName, email, password } = user;

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerNow = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all the fields");
      return;
    }
  };

  return (
    <>
      <PageTitle title="Register | Splendid" />

      <div
        className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 py-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at top right, rgba(134, 239, 172, 0.45), transparent 28%), radial-gradient(circle at bottom left, rgba(190, 242, 100, 0.35), transparent 30%), linear-gradient(to bottom right, #f0fdf4, #ffffff 60%, #ecfdf5)",
        }}
      >
        <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-48 w-48 rounded-full bg-lime-200/30 blur-3xl" />
        <div className="w-full max-w-md bg-white rounded-2xl border border-green-100 shadow-xl p-8">
          <form className="space-y-6" onSubmit={registerNow}>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-800">
                Create an Account
              </h2>
              <p className="text-sm mt-1 text-green-700">
                Join us and start your tracking
              </p>
              <img
                src={logo}
                alt="Splendid logo"
                className="mx-auto mt-4 h-16 w-16 rounded-2xl bg-green-50 p-2 ring-1 ring-green-100 shadow-sm object-contain"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm text-green-800 ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  name="firstName"
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all mt-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-green-800 ml-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  name="lastName"
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all mt-1"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-green-800 ml-1">Email</label>
              <input
                type="email"
                value={email}
                name="email"
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all mt-1"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-green-800 ml-1">Password</label>
              <input
                type="password"
                value={password}
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all mt-1"
              />
            </div>

            <button className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-gray-400 transition-all active:scale-[0.98]">
              Register
            </button>

            <p className="text-sm text-center text-green-700">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-blue-800 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
