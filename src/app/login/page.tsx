"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onLogin = async () => {
    try {
      setLoading(true);

      await axios.post("/api/login", user);

      toast.success("Login successful!");
      router.push("/profile");

    } catch (error: any) {
      const message =
        error.response?.data?.error || "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">
          Login to continue
        </p>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          {/* Email */}
          <div className="mb-5">
            <label className="text-gray-600 text-sm mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="Enter your email"
              value={user.email}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-gray-600 text-sm mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={user.password}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`w-full text-white py-3 rounded-xl font-semibold shadow-md transition
              ${
                buttonDisabled || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center mt-5 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;