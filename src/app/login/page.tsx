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
  const [showPassword, setShowPassword] = useState(false);

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
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');

        .li-root {
          min-height: 100vh;
          display: flex;
          background: #f7f5f0;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Left panel ── */
        .li-left {
          display: none;
          width: 42%;
          background: #141413;
          padding: 48px;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .li-left  { display: flex; }
          .li-right { width: 58%; }
        }

        .li-left-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .li-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .li-brand-mark {
          width: 30px;
          height: 30px;
          background: #f7f5f0;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .li-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #f7f5f0;
        }

        .li-left-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 0;
        }

        .li-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 0;
        }

        .li-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .li-step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          color: #555;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .li-step-title {
          font-family: 'Fraunces', serif;
          font-size: 15px;
          color: #f7f5f0;
          margin-bottom: 3px;
          line-height: 1.3;
        }

        .li-step-desc {
          font-size: 12px;
          color: #4a4a46;
          line-height: 1.5;
        }

        .li-tagline {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 400;
          color: #f7f5f0;
          line-height: 1.25;
          letter-spacing: -0.4px;
          margin: 0 0 14px;
        }

        .li-tagline em {
          font-style: italic;
          color: #8a7f6e;
        }

        .li-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 24px;
        }

        .li-stat-row {
          display: flex;
          gap: 28px;
        }

        .li-stat-num {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          color: #f7f5f0;
          letter-spacing: -0.5px;
        }

        .li-stat-label {
          font-size: 11px;
          color: #4a4a46;
          margin-top: 2px;
        }

        /* ── Right panel ── */
        .li-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .li-form-wrap {
          width: 100%;
          max-width: 380px;
          animation: liUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes liUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .li-form-header {
          margin-bottom: 32px;
        }

        .li-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #b0aa9e;
          margin-bottom: 8px;
        }

        .li-form-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 600;
          color: #1a1916;
          letter-spacing: -0.5px;
          margin: 0;
          line-height: 1.2;
        }

        /* Field */
        .li-field {
          margin-bottom: 18px;
        }

        .li-label {
          font-size: 12px;
          font-weight: 500;
          color: #888;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 7px;
        }

        .li-input-wrap {
          position: relative;
        }

        .li-input {
          width: 100%;
          background: #fff;
          border: 1px solid #e4e1da;
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1916;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .li-input::placeholder { color: #c4bfb5; }

        .li-input:focus {
          border-color: #c4bfb5;
          box-shadow: 0 0 0 3px rgba(180,170,155,0.15);
        }

        .li-input.has-toggle {
          padding-right: 44px;
        }

        .li-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #b0aa9e;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .li-eye-btn:hover { color: #888; }

        /* Forgot row */
        .li-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -8px;
          margin-bottom: 22px;
        }

        .li-forgot {
          font-size: 12px;
          color: #b0aa9e;
          text-decoration: none;
          transition: color 0.15s;
          border-bottom: 1px solid transparent;
        }

        .li-forgot:hover {
          color: #1a1916;
          border-bottom-color: #d4d0c8;
        }

        /* Submit */
        .li-submit {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .li-submit.enabled {
          background: #1a1916;
          color: #f7f5f0;
        }

        .li-submit.enabled:hover {
          background: #2e2c28;
          transform: translateY(-1px);
        }

        .li-submit.enabled:active {
          transform: translateY(0);
        }

        .li-submit.disabled {
          background: #ede9e2;
          color: #c4bfb5;
          cursor: not-allowed;
        }

        .li-submit-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .li-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(247,245,240,0.3);
          border-top-color: #f7f5f0;
          border-radius: 50%;
          animation: liSpin 0.7s linear infinite;
        }

        @keyframes liSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .li-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0 18px;
        }

        .li-divider-line {
          flex: 1;
          height: 1px;
          background: #e4e1da;
        }

        .li-divider-text {
          font-size: 11px;
          color: #c4bfb5;
        }

        /* Footer */
        .li-footer {
          text-align: center;
          font-size: 13px;
          color: #b0aa9e;
        }

        .li-footer a {
          color: #1a1916;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid #d4d0c8;
          transition: border-color 0.15s;
        }

        .li-footer a:hover {
          border-color: #1a1916;
        }
      `}</style>

      <div className="li-root">

        {/* ── Left panel ── */}
        <div className="li-left">
          <div className="li-left-noise" />

          <div className="li-brand">
            <div className="li-brand-mark">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" fill="#141413"/>
              </svg>
            </div>
            <span className="li-brand-name">Authy</span>
          </div>

          <div className="li-left-body">
            <h2 className="li-tagline">
              Good to have<br/>
              <em>you back.</em>
            </h2>

            <div className="li-steps">
              {[
                { n: "01", title: "Pick up where you left off", desc: "Your work, settings, and history — all exactly as you left them." },
                { n: "02", title: "Collaborate in real time", desc: "Jump straight into your team's shared workspace." },
                { n: "03", title: "Stay in flow", desc: "No friction. Just the tools you need, when you need them." },
              ].map((s) => (
                <div className="li-step" key={s.n}>
                  <div className="li-step-num">{s.n}</div>
                  <div>
                    <p className="li-step-title">{s.title}</p>
                    <p className="li-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="li-bottom">
            <div className="li-stat-row">
              {[["12k+", "Active users"], ["99.9%", "Uptime"], ["4.9★", "Avg. rating"]].map(([n, l]) => (
                <div key={l}>
                  <p className="li-stat-num">{n}</p>
                  <p className="li-stat-label">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="li-right">
          <div className="li-form-wrap">

            <div className="li-form-header">
              <p className="li-eyebrow">Welcome back</p>
              <h1 className="li-form-title">
                {loading ? "Signing you in…" : "Sign in"}
              </h1>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>

              {/* Email */}
              <div className="li-field">
                <label className="li-label">Email</label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="you@example.com"
                  value={user.email}
                  className="li-input"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              {/* Password */}
              <div className="li-field">
                <label className="li-label">Password</label>
                <div className="li-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Your password"
                    value={user.password}
                    className="li-input has-toggle"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="li-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="li-forgot-row">
                <Link href="/forgot-password" className="li-forgot">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={buttonDisabled || loading}
                className={`li-submit ${buttonDisabled || loading ? "disabled" : "enabled"}`}
              >
                <span className="li-submit-inner">
                  {loading && <span className="li-spinner" />}
                  {loading ? "Signing in…" : buttonDisabled ? "Enter your details" : "Sign In"}
                </span>
              </button>

            </form>

            <div className="li-divider">
              <span className="li-divider-line" />
              <span className="li-divider-text">new here?</span>
              <span className="li-divider-line" />
            </div>

            <p className="li-footer">
              <Link href="/signup">Create an account →</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;