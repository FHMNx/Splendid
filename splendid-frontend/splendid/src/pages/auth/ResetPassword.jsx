import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance";
import { validateResetToken } from "../../api/authApi";
import PageTitle from "../../components/PageTitle";
import logo from "../../assets/splendid.png";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await validateResetToken(token);
        setValid(true);
      } catch (err) {
        setValid(false);
        toast.error("This reset link is invalid or has expired");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      checkToken();
    } else {
      setValid(false);
      setLoading(false);
      toast.error("This reset link is invalid or has expired");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(
        `/auth/reset-password?token=${token}&password=${password}`,
      );

      toast.success("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 py-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(167, 243, 208, 0.55), transparent 30%), radial-gradient(circle at top right, rgba(209, 250, 229, 0.7), transparent 28%), linear-gradient(to bottom right, #ecfdf5, #ffffff 55%, #f0fdf4)",
        }}
      >
        <div className="pointer-events-none absolute -left-16 top-12 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-12 h-44 w-44 rounded-full bg-lime-200/30 blur-3xl" />

        <div className="w-full max-w-md bg-white rounded-2xl border border-green-100 shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
          <p className="text-green-800 font-semibold">
            Validating your reset link...
          </p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <>
        <PageTitle title="Reset Password | Splendid" />

        <div
          className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 py-8"
          style={{
            backgroundImage:
              "radial-gradient(circle at top left, rgba(167, 243, 208, 0.55), transparent 30%), radial-gradient(circle at top right, rgba(209, 250, 229, 0.7), transparent 28%), linear-gradient(to bottom right, #ecfdf5, #ffffff 55%, #f0fdf4)",
          }}
        >
          <div className="pointer-events-none absolute -left-16 top-12 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-12 h-44 w-44 rounded-full bg-lime-200/30 blur-3xl" />

          <div className="w-full max-w-md bg-white rounded-2xl border border-green-100 shadow-xl p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              ✕
            </div>
            <h2 className="text-xl font-bold text-red-500 text-center">
              Link Invalid or Expired
            </h2>
            <p className="text-sm text-gray-500 text-center">
              This password reset link is no longer valid.
            </p>
            <Link
              to="/forgot-password"
              className="w-full inline-flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-gray-400 transition-all active:scale-[0.98]"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Reset Password | Splendid" />

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
                Reset Password
              </h2>
              <p className="text-sm text-green-700 mt-1">
                Enter your new password below
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-green-800 ml-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter your new password"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-green-800 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all mt-1"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-gray-400 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-sm text-center text-green-700">
              Remembered your password?{" "}
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

export default ResetPassword;
