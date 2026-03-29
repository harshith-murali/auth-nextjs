"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');

        .su-root {
          min-height: 100vh;
          display: flex;
          background: #f7f5f0;
          font-family: 'DM Sans', sans-serif;
        }

        /* Left panel */
        .su-left {
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
          .su-left { display: flex; }
          .su-right { width: 58%; }
        }

        .su-left-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .su-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .su-brand-mark {
          width: 30px;
          height: 30px;
          background: #f7f5f0;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .su-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #f7f5f0;
        }

        .su-left-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 0;
        }

        .su-tagline {
          font-family: 'Fraunces', serif;
          font-size: 36px;
          font-weight: 400;
          color: #f7f5f0;
          line-height: 1.25;
          letter-spacing: -0.5px;
          margin: 0 0 16px;
        }

        .su-tagline em {
          font-style: italic;
          color: #a09880;
        }

        .su-tagline-sub {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          max-width: 260px;
        }

        .su-testimonial {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 24px;
        }

        .su-testimonial-text {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 15px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .su-testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .su-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #2a2a28;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          color: #888;
        }

        .su-author-info p {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        .su-author-info strong {
          color: #aaa;
          font-weight: 500;
        }

        /* Right panel */
        .su-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .su-form-wrap {
          width: 100%;
          max-width: 380px;
          animation: suUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes suUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .su-form-header {
          margin-bottom: 32px;
        }

        .su-form-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #b0aa9e;
          margin-bottom: 8px;
        }

        .su-form-title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 600;
          color: #1a1916;
          letter-spacing: -0.5px;
          margin: 0;
          line-height: 1.2;
        }

        .su-form-title.loading-title {
          color: #b0aa9e;
        }

        /* Field */
        .su-field {
          margin-bottom: 18px;
        }

        .su-label {
          font-size: 12px;
          font-weight: 500;
          color: #888;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 7px;
        }

        .su-input-wrap {
          position: relative;
        }

        .su-input {
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

        .su-input::placeholder { color: #c4bfb5; }

        .su-input:focus {
          border-color: #c4bfb5;
          box-shadow: 0 0 0 3px rgba(180,170,155,0.15);
        }

        .su-input.has-toggle {
          padding-right: 44px;
        }

        .su-eye-btn {
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

        .su-eye-btn:hover { color: #888; }

        /* Submit */
        .su-submit {
          width: 100%;
          margin-top: 8px;
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
        }

        .su-submit.enabled {
          background: #1a1916;
          color: #f7f5f0;
        }

        .su-submit.enabled:hover {
          background: #2e2c28;
          transform: translateY(-1px);
        }

        .su-submit.enabled:active {
          transform: translateY(0);
        }

        .su-submit.disabled {
          background: #ede9e2;
          color: #c4bfb5;
          cursor: not-allowed;
        }

        .su-submit-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .su-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(247,245,240,0.3);
          border-top-color: #f7f5f0;
          border-radius: 50%;
          animation: suSpin 0.7s linear infinite;
        }

        @keyframes suSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .su-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0 18px;
        }

        .su-divider-line {
          flex: 1;
          height: 1px;
          background: #e4e1da;
        }

        .su-divider-text {
          font-size: 11px;
          color: #c4bfb5;
        }

        /* Footer */
        .su-footer {
          text-align: center;
          font-size: 13px;
          color: #b0aa9e;
        }

        .su-footer a {
          color: #1a1916;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid #d4d0c8;
          transition: border-color 0.15s;
        }

        .su-footer a:hover {
          border-color: #1a1916;
        }

        /* Strength bar */
        .su-strength {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .su-strength-seg {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: #e4e1da;
          transition: background 0.25s;
        }

        .su-strength-seg.weak  { background: #e07b5a; }
        .su-strength-seg.fair  { background: #e0b45a; }
        .su-strength-seg.good  { background: #7ab87a; }
        .su-strength-seg.strong { background: #4a9e6e; }
      `}</style>

      <div className="su-root">

        {/* ── Left panel ── */}
        <div className="su-left">
          <div className="su-left-noise" />

          <div className="su-brand">
            <div className="su-brand-mark">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" fill="#141413"/>
              </svg>
            </div>
            <span className="su-brand-name">Authy</span>
          </div>

          <div className="su-left-body">
            <h2 className="su-tagline">
              The workspace<br/>
              <em>you've been</em><br/>
              waiting for.
            </h2>
            <p className="su-tagline-sub">
              Simple, focused, and built for people who care about their craft.
            </p>
          </div>

          <div className="su-testimonial">
            <p className="su-testimonial-text">
              "Switched three months ago and I haven't looked back. It just works."
            </p>
            <div className="su-testimonial-author">
              <div className="su-avatar">HM</div>
              <div className="su-author-info">
                <p><strong>Harshith M</strong></p>
                <p>Full Stack Web Developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="su-right">
          <div className="su-form-wrap">

            <div className="su-form-header">
              <p className="su-form-eyebrow">Get started</p>
              <h1 className={`su-form-title ${loading ? "loading-title" : ""}`}>
                {loading ? "Creating your account…" : "Create an account"}
              </h1>
            </div>

            {/* Username */}
            <div className="su-field">
              <label className="su-label">Username</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="yourname"
                className="su-input"
              />
            </div>

            {/* Email */}
            <div className="su-field">
              <label className="su-label">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="you@example.com"
                className="su-input"
              />
            </div>

            {/* Password */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="su-input has-toggle"
                />
                <button
                  type="button"
                  className="su-eye-btn"
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
              {/* Password strength */}
              {user.password.length > 0 && (
                <div className="su-strength">
                  {[1, 2, 3, 4].map((seg) => {
                    const len = user.password.length;
                    const score = len < 6 ? 1 : len < 10 ? 2 : len < 14 ? 3 : 4;
                    const cls = seg <= score
                      ? score === 1 ? "weak" : score === 2 ? "fair" : score === 3 ? "good" : "strong"
                      : "";
                    return <div key={seg} className={`su-strength-seg ${cls}`} />;
                  })}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={onSignup}
              disabled={buttonDisabled}
              className={`su-submit ${buttonDisabled ? "disabled" : "enabled"}`}
            >
              <span className="su-submit-inner">
                {loading && <span className="su-spinner" />}
                {loading ? "Creating account…" : buttonDisabled ? "Fill in all fields" : "Create Account"}
              </span>
            </button>

            <div className="su-divider">
              <span className="su-divider-line" />
              <span className="su-divider-text">already a member?</span>
              <span className="su-divider-line" />
            </div>

            <p className="su-footer">
              <Link href="/login">Sign in to your account →</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
};

export default SignupPage;