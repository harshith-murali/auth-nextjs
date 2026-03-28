"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const res = await axios.get("/api/me");
      setUser(res.data.user);
    } catch (error: any) {
      toast.error("Unauthorized. Please login.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-gray-100">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200 text-center">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800">
          Profile
        </h1>
        <p className="text-gray-500 mt-2 mb-6">
          Your account details
        </p>

        {/* User Info */}
        {user && (
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Username:</span>{" "}
              {user.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {user.email}
            </p>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;