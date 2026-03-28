"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
const SignupPage = () => {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.username.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/signup", user);

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.error || "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-gray-100">
      {/* Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {loading ? "Loading, Please Wait..." : "Create Account"}
        </h1>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className={`w-full transition duration-200 text-white py-3 rounded-lg font-semibold shadow-md
    ${
      buttonDisabled
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
    }`}
        >
          {buttonDisabled ? "No Signup" : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
