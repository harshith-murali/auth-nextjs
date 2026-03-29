"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = params.get("token");
    if (t) setToken(t);
  }, [params]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      (prev as HTMLInputElement)?.focus();
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const otpString = otp.join("");

      if (token) {
        await axios.post("/api/reset-password", { token, password });
      } else {
        if (!email || otpString.length < 6) {
          toast.error("Email and complete OTP are required");
          setLoading(false);
          return;
        }
        await axios.post("/api/reset-password", { email, otp: otpString, password });
      }

      toast.success("Password updated!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rp-root {
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

        .rp-root::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%);
          top: -200px; right: -100px;
          pointer-events: none;
        }
        .rp-root::after {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
          bottom: -150px; left: -100px;
          pointer-events: none;
        }

        .rp-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .rp-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
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

        .rp-topbar {
          position: absolute;
          top: 0; left: 24px; right: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent);
        }

        /* Icon */
        .rp-icon-wrap {
          width: 68px; height: 68px;
          border-radius: 50%;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .rp-icon-wrap svg { width: 30px; height: 30px; }

        .rp-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          text-align: center; margin-bottom: 8px;
        }
        .rp-title {
          font-size: 26px; font-weight: 700;
          color: #f9fafb; text-align: center;
          letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .rp-subtitle {
          font-size: 13px; color: rgba(255,255,255,0.3);
          text-align: center; line-height: 1.6; margin-bottom: 32px;
        }

        /* Field group */
        .rp-field { margin-bottom: 16px; }
        .rp-field-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px; display: block;
          font-family: 'JetBrains Mono', monospace;
        }
        .rp-input {
          width: 100%; padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #f9fafb;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .rp-input::placeholder { color: rgba(255,255,255,0.2); }
        .rp-input:focus {
          border-color: rgba(16,185,129,0.4);
          background: rgba(255,255,255,0.06);
        }

        /* Password wrapper */
        .rp-pw-wrap { position: relative; }
        .rp-pw-wrap .rp-input { padding-right: 48px; }
        .rp-pw-toggle {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.25);
          display: flex; align-items: center;
          transition: color 0.2s; padding: 4px;
        }
        .rp-pw-toggle:hover { color: rgba(255,255,255,0.6); }
        .rp-pw-toggle svg { width: 18px; height: 18px; }

        /* OTP boxes */
        .rp-otp-wrap {
          display: flex; gap: 8px; justify-content: space-between;
        }
        .rp-otp-box {
          flex: 1; aspect-ratio: 1;
          max-width: 56px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #f9fafb;
          font-family: 'JetBrains Mono', monospace;
          font-size: 20px; font-weight: 600;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          caret-color: #10b981;
        }
        .rp-otp-box:focus {
          border-color: rgba(16,185,129,0.5);
          background: rgba(16,185,129,0.05);
        }

        .rp-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 24px 0;
        }

        /* Button */
        .rp-btn {
          width: 100%; padding: 14px;
          border-radius: 12px;
          border: none; cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .rp-btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          box-shadow: 0 4px 20px rgba(16,185,129,0.25);
        }
        .rp-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(16,185,129,0.35);
          background: linear-gradient(135deg, #34d399, #10b981);
        }
        .rp-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .rp-btn-primary:disabled {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.25);
          cursor: not-allowed; box-shadow: none;
        }

        .rp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .rp-footer {
          font-size: 12px; color: rgba(255,255,255,0.2);
          text-align: center; margin-top: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <div className="rp-root">
        <div className="rp-grid" />
        <div className="rp-card">
          <div className="rp-topbar" />

          {/* Icon */}
          <div className="rp-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <p className="rp-label">Account Security</p>
          <h1 className="rp-title">Reset Password</h1>
          <p className="rp-subtitle">
            {token
              ? "Choose a strong new password for your account"
              : "Enter your email, OTP, and a new password"}
          </p>

          {/* Email + OTP (no token flow) */}
          {!token && (
            <>
              <div className="rp-field">
                <label className="rp-field-label">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="rp-input"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="rp-field">
                <label className="rp-field-label">One-time code</label>
                <div className="rp-otp-wrap">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      className="rp-otp-box"
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* New password */}
          <div className="rp-field">
            <label className="rp-field-label">New password</label>
            <div className="rp-pw-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="rp-input"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="rp-pw-toggle"
                onClick={() => setShowPassword((p) => !p)}
                type="button"
                aria-label="Toggle password"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="rp-divider" />

          <button
            className="rp-btn rp-btn-primary"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="rp-spinner" />
                Updating password…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Reset Password
              </>
            )}
          </button>

          <p className="rp-footer">secured · encrypted · private</p>
        </div>
      </div>
    </>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ width: 28, height: 28, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}