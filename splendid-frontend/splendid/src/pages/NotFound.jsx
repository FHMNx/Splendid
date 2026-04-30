import React from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";

const NotFound = () => {
  return (
    <>
      <PageTitle title="404 - Not Found | Splendid" />

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
          <h1 className="text-3xl font-bold text-green-800">
            404 - Page Not Found
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            The page you are looking for does not exist.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-green-800 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
