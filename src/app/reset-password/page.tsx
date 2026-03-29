"use client";

import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("/api/reset-password", {
        token,
        password,
      });

      toast.success("Password updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.error);
    }
  };

  return (
    <div>
      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}