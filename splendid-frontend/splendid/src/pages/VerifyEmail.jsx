import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        toast.error("Invalid verification link");
        navigate("/login");
        return;
      }

      try {
        const res = await api.get(`/auth/verify?token=${token}`);

        toast.success("Email verified successfully");

        // redirect after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        toast.error("Verification failed");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold text-green-700">
        Verifying your email...
      </h2>
    </div>
  );
};

export default VerifyEmail;
