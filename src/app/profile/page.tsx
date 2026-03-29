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

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "··";

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');
          .pr-loading {
            min-height: 100vh;
            background: #f7f5f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
          }
          .pr-loading-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .pr-load-ring {
            width: 32px;
            height: 32px;
            border: 2px solid #e4e1da;
            border-top-color: #1a1916;
            border-radius: 50%;
            animation: prSpin 0.8s linear infinite;
          }
          @keyframes prSpin { to { transform: rotate(360deg); } }
          .pr-load-text {
            font-size: 13px;
            color: #b0aa9e;
          }
        `}</style>
        <div className="pr-loading">
          <div className="pr-loading-inner">
            <div className="pr-load-ring" />
            <p className="pr-load-text">Loading your profile…</p>
          </div>
        </div>
      </>
    );
  }

  // ── Profile ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');

        .pr-root {
          min-height: 100vh;
          display: flex;
          background: #f7f5f0;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Left panel ── */
        .pr-left {
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
          .pr-left  { display: flex; }
          .pr-right { width: 58%; }
        }

        .pr-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .pr-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pr-brand-mark {
          width: 30px;
          height: 30px;
          background: #f7f5f0;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pr-brand-name {
          font-size: 15px;
          font-weight: 500;
          color: #f7f5f0;
        }

        .pr-left-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 0;
          gap: 32px;
        }

        .pr-left-tagline {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 400;
          color: #f7f5f0;
          line-height: 1.25;
          letter-spacing: -0.4px;
        }

        .pr-left-tagline em {
          font-style: italic;
          color: #8a7f6e;
        }

        .pr-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pr-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }

        .pr-nav-item.active {
          background: rgba(255,255,255,0.06);
        }

        .pr-nav-item:hover:not(.active) {
          background: rgba(255,255,255,0.03);
        }

        .pr-nav-icon {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pr-nav-icon.active-icon {
          background: rgba(255,255,255,0.08);
        }

        .pr-nav-icon.inactive-icon {
          background: transparent;
        }

        .pr-nav-label {
          font-size: 13px;
          font-weight: 500;
        }

        .pr-nav-label.active-label { color: #f7f5f0; }
        .pr-nav-label.inactive-label { color: #444; }

        .pr-left-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 24px;
        }

        .pr-session-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pr-session-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4a9e6e;
        }

        .pr-session-text {
          font-size: 12px;
          color: #4a4a46;
        }

        /* ── Right panel ── */
        .pr-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .pr-content {
          width: 100%;
          max-width: 380px;
          animation: prUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes prUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Avatar */
        .pr-avatar-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .pr-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #1a1916;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: #f7f5f0;
          letter-spacing: 1px;
          flex-shrink: 0;
        }

        .pr-avatar-info {}

        .pr-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #b0aa9e;
          margin-bottom: 4px;
        }

        .pr-name {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 600;
          color: #1a1916;
          letter-spacing: -0.4px;
          line-height: 1.2;
        }

        /* Info card */
        .pr-card {
          background: #fff;
          border: 1px solid #e4e1da;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .pr-card-row {
          display: flex;
          align-items: center;
          padding: 14px 18px;
          gap: 14px;
        }

        .pr-card-row + .pr-card-row {
          border-top: 1px solid #f0ede6;
        }

        .pr-row-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f7f5f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pr-row-body {
          flex: 1;
          min-width: 0;
        }

        .pr-row-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #b0aa9e;
          margin-bottom: 2px;
        }

        .pr-row-value {
          font-size: 14px;
          color: #1a1916;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Verified badge */
        .pr-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 9px;
          border-radius: 20px;
        }

        .pr-badge.verified {
          background: rgba(74,158,110,0.1);
          color: #3a7a55;
        }

        .pr-badge.unverified {
          background: rgba(224,123,90,0.1);
          color: #a0452a;
        }

        .pr-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .verified .pr-badge-dot { background: #4a9e6e; }
        .unverified .pr-badge-dot { background: #e07b5a; }

        /* Logout button */
        .pr-logout {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: 1px solid #e4e1da;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
          background: transparent;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .pr-logout:hover {
          background: #1a1916;
          border-color: #1a1916;
          color: #f7f5f0;
        }

        .pr-logout:hover .pr-logout-icon {
          color: #f7f5f0;
        }
      `}</style>

      <div className="pr-root">

        {/* ── Left panel ── */}
        <div className="pr-left">
          <div className="pr-noise" />

          <div className="pr-brand">
            <div className="pr-brand-mark">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" fill="#141413"/>
              </svg>
            </div>
            <span className="pr-brand-name">Authy</span>
          </div>

          <div className="pr-left-body">
            <h2 className="pr-left-tagline">
              Your space,<br/>
              <em>your rules.</em>
            </h2>

            <nav className="pr-nav">
              {[
                { label: "Profile", active: true, icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke={true ? "#f7f5f0" : "#555"} strokeWidth="1.5"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={true ? "#f7f5f0" : "#555"} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )},
                { label: "Settings", active: false, icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="#555" strokeWidth="1.5"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )},
                { label: "Activity", active: false, icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )},
              ].map((item) => (
                <a key={item.label} href="#" className={`pr-nav-item ${item.active ? "active" : ""}`}>
                  <div className={`pr-nav-icon ${item.active ? "active-icon" : "inactive-icon"}`}>
                    {item.icon}
                  </div>
                  <span className={`pr-nav-label ${item.active ? "active-label" : "inactive-label"}`}>
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="pr-left-bottom">
            <div className="pr-session-row">
              <div className="pr-session-dot" />
              <p className="pr-session-text">Active session · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="pr-right">
          <div className="pr-content">

            {/* Avatar + name */}
            <div className="pr-avatar-wrap">
              <div className="pr-avatar">{initials}</div>
              <div className="pr-avatar-info">
                <p className="pr-eyebrow">Account</p>
                <p className="pr-name">{user?.username || "Unknown"}</p>
              </div>
            </div>

            {/* Info card */}
            <div className="pr-card">
              {/* Username row */}
              <div className="pr-card-row">
                <div className="pr-row-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="#888" strokeWidth="1.5"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="pr-row-body">
                  <p className="pr-row-label">Username</p>
                  <p className="pr-row-value">{user?.username}</p>
                </div>
              </div>

              {/* Email row */}
              <div className="pr-card-row">
                <div className="pr-row-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#888" strokeWidth="1.5"/>
                    <path d="M2 7l10 7 10-7" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="pr-row-body">
                  <p className="pr-row-label">Email</p>
                  <p className="pr-row-value">{user?.email}</p>
                </div>
                <span className={`pr-badge ${user?.isVerified ? "verified" : "unverified"}`}>
                  <span className="pr-badge-dot" />
                  {user?.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>

              {/* Member since row */}
              <div className="pr-card-row">
                <div className="pr-row-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#888" strokeWidth="1.5"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="pr-row-body">
                  <p className="pr-row-label">Member since</p>
                  <p className="pr-row-value">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button className="pr-logout" onClick={logout}>
              <svg className="pr-logout-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Sign out
            </button>

          </div>
        </div>

      </div>
    </>
  );
};

export default ProfilePage;