"use client";
export const dynamic = "force-dynamic";


import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter(); // ✅ FIXED (inside component)

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ get token after mount
  useEffect(() => {
    const t = params.get("token");
    if (t) setToken(t);
  }, [params]);

  const handleReset = async () => {
    if (!token || !password) {
      toast.error("Token and password are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/reset-password", {
        token,
        password,
      });

      toast.success("Password updated!");

      // ✅ redirect after success
      router.push("/login");

    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}