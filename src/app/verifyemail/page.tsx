"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Status = "loading" | "success" | "error";

const VerifyEmail = () => {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const verifyUserEmail = async (token: string) => {
    try {
      await axios.post(`/api/verifyemail`, { token });
      setStatus("success");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Verification failed");
      setStatus("error");
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
      setError("Invalid or missing token");
      setStatus("error");
    }
  }, [token]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ve-root {
          font-family: 'Sora', sans-serif;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        /* Ambient light blobs */
        .ve-root::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          pointer-events: none;
        }
        .ve-root::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
          bottom: -150px;
          left: -100px;
          pointer-events: none;
        }

        /* Grid texture */
        .ve-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Card */
        .ve-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 48px 40px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top bar accent */
        .ve-topbar {
          position: absolute;
          top: 0; left: 24px; right: 24px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent);
          border-radius: 1px;
        }

        /* Icon ring */
        .ve-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          position: relative;
        }
        .ve-icon-wrap.loading {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .ve-icon-wrap.success {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.25);
        }
        .ve-icon-wrap.error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
        }

        .ve-icon-wrap svg {
          width: 32px;
          height: 32px;
        }

        /* Spinner */
        .ve-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255,255,255,0.08);
          border-top-color: rgba(16,185,129,0.8);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Pulse ring for success */
        .ve-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid rgba(16,185,129,0.25);
          animation: pulseRing 2s ease-out infinite;
        }
        @keyframes pulseRing {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0;   transform: scale(1.35); }
        }

        /* Text */
        .ve-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          text-align: center;
          margin-bottom: 10px;
        }
        .ve-title {
          font-size: 26px;
          font-weight: 700;
          color: #f9fafb;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .ve-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          text-align: center;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        /* Status message */
        .ve-status {
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 24px;
          animation: fadeUp 0.4s ease both;
        }
        .ve-status.success {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          color: #6ee7b7;
        }
        .ve-status.error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.18);
          color: #fca5a5;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Buttons */
        .ve-btn {
          display: block;
          width: 100%;
          padding: 14px 20px;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .ve-btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          border: none;
          box-shadow: 0 4px 20px rgba(16,185,129,0.25);
        }
        .ve-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(16,185,129,0.35);
          background: linear-gradient(135deg, #34d399, #10b981);
        }
        .ve-btn-primary:active { transform: translateY(0); }

        .ve-btn-secondary {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ve-btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          transform: translateY(-1px);
        }

        /* Divider */
        .ve-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 28px 0;
        }

        /* Footer hint */
        .ve-footer {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          text-align: center;
          margin-top: 24px;
          font-family: 'JetBrains Mono', monospace;
        }

        /* Loading dots */
        .ve-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 28px;
        }
        .ve-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(16,185,129,0.5);
          animation: dotBounce 1.2s ease-in-out infinite;
        }
        .ve-dot:nth-child(2) { animation-delay: 0.15s; }
        .ve-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div className="ve-root">
        <div className="ve-grid" />

        <div className="ve-card">
          <div className="ve-topbar" />

          {/* Icon */}
          <div className={`ve-icon-wrap ${status}`}>
            {status === "loading" && <div className="ve-spinner" />}
            {status === "success" && (
              <>
                <div className="ve-pulse" />
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </>
            )}
            {status === "error" && (
              <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            )}
          </div>

          {/* Label */}
          <p className="ve-label">Email Verification</p>

          {/* Title + Subtitle */}
          <h1 className="ve-title">
            {status === "loading" && "Verifying your email"}
            {status === "success" && "You're all set!"}
            {status === "error" && "Verification failed"}
          </h1>
          <p className="ve-subtitle">
            {status === "loading" && "Hang tight, we're confirming your account…"}
            {status === "success" && "Your email has been verified. You can now sign in and access your account."}
            {status === "error" && (error || "Something went wrong with the verification link.")}
          </p>

          {/* Loading dots */}
          {status === "loading" && (
            <div className="ve-dots">
              <div className="ve-dot" />
              <div className="ve-dot" />
              <div className="ve-dot" />
            </div>
          )}

          {/* Success CTA */}
          {status === "success" && (
            <>
              <div className="ve-status success">
                ✦ Identity confirmed — welcome aboard
              </div>
              <Link href="/login" className="ve-btn ve-btn-primary">
                Continue to Login →
              </Link>
            </>
          )}

          {/* Error CTA */}
          {status === "error" && (
            <>
              <div className="ve-status error">
                This link may have expired or already been used
              </div>
              <Link href="/signup" className="ve-btn ve-btn-secondary">
                Back to Sign Up
              </Link>
            </>
          )}

          <div className="ve-divider" />
          <p className="ve-footer">secured · encrypted · private</p>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;