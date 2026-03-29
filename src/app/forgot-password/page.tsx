"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("/api/forgot-password", { email });

      toast.success("Reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
        
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your email to receive a reset link
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full text-white py-3 rounded-xl font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}