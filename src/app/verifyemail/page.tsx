"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const VerifyEmail = () => {
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = async (token: string) => {
    try {
      await axios.post(`/api/verifyemail`, { token });
      setVerified(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail(token);
    } else {
      setLoading(false);
      setError("Invalid or missing token");
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200 text-center">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          Verify Email
        </h1>
        <p className="text-gray-500 mt-2 mb-6">
          Please wait while we verify your account
        </p>

        {/* Loading */}
        {loading && (
          <p className="text-gray-600">Verifying your email...</p>
        )}

        {/* Success */}
        {verified && (
          <div>
            <p className="text-green-600 font-medium mb-4">
              Email verified successfully 🎉
            </p>
            <Link
              href="/login"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition active:scale-95"
            >
              Go to Login
            </Link>
          </div>
        )}

        {/* Error */}
        {error && (
          <div>
            <p className="text-red-500 mb-4">{error}</p>
            <Link
              href="/signup"
              className="block w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Go to Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;