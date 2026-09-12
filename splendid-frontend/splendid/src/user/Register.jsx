import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import logo from "../assets/splendid.png";
import { toast } from "react-hot-toast";
import { registerUser } from "../features/auth/authAPI";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, password } = user;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$#!%*?&]{8,}$/;

  // CHECK PASSWORD STRENGTH
  const getPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";

    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score === 3) return "Medium";
    return "Strong";
  };

  const passwordStrength = getPasswordStrength(password);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerNow = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ chars, include uppercase, lowercase, and number",
      );
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(user);

      toast.success("Registration successful! Please verify your email.");
      setUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      const token = tokenResponse.access_token || tokenResponse.credential;
      const response = await loginWithGoogle(token);
      const data = response.data;
      toast.success(`Welcome to Splendid, ${data.firstName}!`);

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Google sign up failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google registration error:", error);
    toast.error("Google sign up failed. Please try again.");
  };

  const googleLoginAction = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

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
            <div className="flex justify-start">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-100"
              >
                <span aria-hidden="true">←</span>
                Back to Home
              </Link>
            </div>

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
              {password && (
                <p
                  className={`text-sm mt-1 font-semibold ${passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Medium"
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                >
                  Strength: {passwordStrength}
                </p>
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-gray-400 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Registering..." : "Register Now"}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-xs text-gray-500 font-medium uppercase">or</span>
              <div className="border-t border-gray-200 w-full"></div>
            </div>

            <button
              type="button"
              onClick={() => googleLoginAction()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-semibold py-3 rounded-2xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.6 18.9 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2c-2.1 1.6-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.6 39.5 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.5-2.3 4.5-4 5.9l.1-.1 6.3 5.2C37.3 39.3 44 34 44 24c0-1.3-.1-2.3-.4-3.5z"
                />
              </svg>
              Sign up with Google
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
