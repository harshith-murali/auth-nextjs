"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"LINK" | "OTP">("LINK");
  const [sent, setSent] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/forgot-password", { email, type });

      setSent(true);
      toast.success(
        type === "OTP" ? "OTP sent to your email!" : "Reset link sent!"
      );

      if (type === "OTP") {
        router.push(`/reset-password?email=${email}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500&display=swap');

        .fp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0e0e0f;
          background-image:
            radial-gradient(ellipse 60% 50% at 50% -10%, rgba(255,255,255,0.04) 0%, transparent 100%);
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .fp-card {
          width: 100%;
          max-width: 400px;
          background: #161618;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 36px 36px;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fp-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .fp-title {
          font-family: 'Instrument Serif', serif;
          font-size: 26px;
          color: #f5f4f0;
          letter-spacing: -0.5px;
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .fp-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0 0 28px;
          line-height: 1.5;
        }

        .fp-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #0e0e0f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 3px;
          gap: 3px;
          margin-bottom: 20px;
        }

        .fp-toggle-btn {
          padding: 9px;
          border-radius: 8px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          color: #555;
          background: transparent;
        }

        .fp-toggle-btn.active {
          background: #232325;
          color: #f0eeea;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .fp-label {
          font-size: 12px;
          font-weight: 500;
          color: #555;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .fp-input {
          width: 100%;
          background: #0e0e0f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #f0eeea;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
          margin-bottom: 20px;
        }

        .fp-input::placeholder { color: #444; }

        .fp-input:focus {
          border-color: rgba(255,255,255,0.22);
        }

        .fp-hint {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: #444;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .fp-hint-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3a3a3a;
          flex-shrink: 0;
        }

        .fp-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          position: relative;
          overflow: hidden;
          background: #f0eeea;
          color: #0e0e0f;
        }

        .fp-btn:hover:not(:disabled) {
          background: #ffffff;
          transform: translateY(-1px);
        }

        .fp-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .fp-btn:disabled {
          background: #222;
          color: #444;
          cursor: not-allowed;
        }

        .fp-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .fp-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #555;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .fp-success {
          text-align: center;
          padding: 8px 0 4px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .fp-success-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .fp-success-title {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: #f5f4f0;
          margin: 0 0 8px;
        }

        .fp-success-text {
          font-size: 14px;
          color: #555;
          line-height: 1.5;
          margin: 0 0 24px;
        }

        .fp-back {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #666;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
        }

        .fp-back:hover {
          background: rgba(255,255,255,0.04);
          color: #999;
        }

        .fp-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 16px;
        }

        .fp-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .fp-divider-text {
          font-size: 11px;
          color: #3a3a3a;
        }

        .fp-signin {
          text-align: center;
          font-size: 13px;
          color: #444;
        }

        .fp-signin a {
          color: #888;
          text-decoration: none;
          transition: color 0.15s;
        }

        .fp-signin a:hover { color: #bbb; }
      `}</style>

      <div className="fp-root">
        <div className="fp-card">

          {sent && type === "LINK" ? (
            // ── Success state ──────────────────────────────────────────
            <div className="fp-success">
              <div className="fp-success-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="fp-success-title">Check your inbox</p>
              <p className="fp-success-text">
                We sent a password reset link to<br/>
                <span style={{ color: "#888" }}>{email}</span>
              </p>
              <button className="fp-back" onClick={() => setSent(false)}>
                Try a different email
              </button>
            </div>

          ) : (
            // ── Form state ─────────────────────────────────────────────
            <>
              <div className="fp-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#555" strokeWidth="1.5"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              <h1 className="fp-title">Forgot password?</h1>
              <p className="fp-subtitle">Choose how you'd like to reset it.</p>

              {/* Toggle */}
              <div className="fp-toggle">
                <button
                  className={`fp-toggle-btn ${type === "LINK" ? "active" : ""}`}
                  onClick={() => setType("LINK")}
                >
                  Reset Link
                </button>
                <button
                  className={`fp-toggle-btn ${type === "OTP" ? "active" : ""}`}
                  onClick={() => setType("OTP")}
                >
                  One-Time Code
                </button>
              </div>

              {/* Hint */}
              <div className="fp-hint">
                <span className="fp-hint-dot" />
                {type === "LINK"
                  ? "We'll email you a secure link. Valid for 1 hour."
                  : "We'll send a 6-digit code to verify your identity."}
              </div>

              {/* Email */}
              <label className="fp-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="fp-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />

              {/* Submit */}
              <button
                className="fp-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className="fp-btn-inner">
                  {loading && <span className="fp-spinner" />}
                  {loading
                    ? "Sending…"
                    : type === "OTP"
                    ? "Send Code"
                    : "Send Reset Link"}
                </span>
              </button>

              <div className="fp-divider">
                <span className="fp-divider-line" />
                <span className="fp-divider-text">or</span>
                <span className="fp-divider-line" />
              </div>

              <p className="fp-signin">
                Remember it? <a href="/login">Sign in</a>
              </p>
            </>
          )}

        </div>
      </div>
    </>
  );
}
