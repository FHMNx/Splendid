import { useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import logo from "../../assets/splendid.png";
import { toast } from "react-toastify";
import { forgotPassword } from "../../api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success(
        "If this email is registered, you'll receive a reset link shortly",
      );
      setEmail("");
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
                className="mx-auto mt-4 h-16 w-16 rounded-2xl bg-green-50 p-2 ring-1 ring-green-100 shadow-sm object-contain"
              />
              <h2 className="text-3xl font-bold text-green-800 mt-4">
                Forgot Password
              </h2>
              <p className="text-sm text-green-700 mt-1">
                Enter your email to receive a reset link
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-green-800 ml-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-gray-400 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-sm text-center text-green-700">
              Remember your password?{" "}
              <Link
                to="/login"
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

export default ForgotPassword;
