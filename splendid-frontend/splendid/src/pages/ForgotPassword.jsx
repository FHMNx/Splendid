import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import logo from "../assets/splendid.png";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../features/auth/authAPI";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      toast.success("Password reset link sent to your email!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Forgot Password | Splendid" />

      <div
        className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 py-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(167, 243, 208, 0.55), transparent 30%), radial-gradient(circle at top right, rgba(209, 250, 229, 0.7), transparent 28%), linear-gradient(to bottom right, #ecfdf5, #ffffff 55%, #f0fdf4)",
        }}
      >
        <div className="pointer-events-none absolute -left-16 top-12 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-12 h-44 w-44 rounded-full bg-lime-200/30 blur-3xl" />

        <div className="w-full max-w-md bg-white rounded-2xl border border-green-100 shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="text-center">
              <img
                src={logo}
                alt="Splendid logo"
                className="mx-auto h-16 w-16 rounded-2xl bg-green-50 p-2 ring-1 ring-green-100 shadow-sm object-contain"
              />
              <h2 className="mt-4 text-3xl font-bold text-green-800">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-green-700">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-green-800 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-gray-400 transition-all active:scale-[0.98]"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-sm text-center text-green-700">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-800 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
