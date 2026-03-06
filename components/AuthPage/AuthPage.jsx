"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaApple,
  FaChevronLeft,
  FaCircle,
  FaFacebookF,
  FaGoogle,
  FaLocationDot,
  FaRegEye,
  FaRegEyeSlash
} from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { IoCarSportOutline } from "react-icons/io5";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AuthPage() {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "reader"
  });
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [upgrade, setUpgrade] = useState({ bio: "", website: "" });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const isReader = user?.role === "READER";
  const isAuthor = user?.role === "AUTHOR" || user?.role === "ADMIN";

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    try {
      const savedToken = window.localStorage.getItem("ss_access_token") || "";
      if (savedToken) {
        setToken(savedToken);
      }

      const params = new URLSearchParams(window.location.search);
      const socialToken = params.get("accessToken");
      const socialError = params.get("error");

      if (socialToken) {
        window.localStorage.setItem("ss_access_token", socialToken);
        setToken(socialToken);
        setStatus({ type: "success", message: "Social login successful." });
        window.history.replaceState({}, "", "/auth");
        return;
      }

      if (socialError) {
        setStatus({ type: "error", message: socialError });
        window.history.replaceState({}, "", "/auth");
      }
    } catch {
      setStatus({ type: "error", message: "Unable to access browser storage for session state." });
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    async function fetchMe() {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: authHeaders,
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Session expired. Please login again.");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        setStatus({ type: "error", message: error.message });
        setToken("");
        window.localStorage.removeItem("ss_access_token");
      }
    }

    fetchMe();
  }, [token, authHeaders]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function onUpgradeChange(event) {
    const { name, value } = event.target;
    setUpgrade((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (mode === "signup" && !agreeTerms) {
      setStatus({ type: "error", message: "You must agree to the terms to create an account." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "signup"
          ? {
              name: form.name,
              email: form.email,
              password: form.password,
              accountType: form.accountType
            }
          : {
              email: form.email,
              password: form.password
            };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      setToken(data.accessToken);
      setUser(data.user);
      window.localStorage.setItem("ss_access_token", data.accessToken);
      setStatus({ type: "success", message: `Welcome, ${data.user.name}.` });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function onUpgrade(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE}/api/auth/upgrade-to-author`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders
        },
        credentials: "include",
        body: JSON.stringify({
          bio: upgrade.bio,
          website: upgrade.website
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upgrade failed.");
      }

      setUser(data.user);
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function onLogout() {
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setToken("");
      setUser(null);
      window.localStorage.removeItem("ss_access_token");
      setLoading(false);
    }
  }

  function startSocial(provider) {
    window.location.href = `${API_BASE}/api/auth/oauth/${provider}`;
  }

  return (
    <main className="auth-page-main">
      <section className="auth-page-shell" aria-label="Authentication">
        <aside className="auth-page-visual">
          <div className="auth-visual-chip auth-visual-chip-top">
            <FaLocationDot aria-hidden="true" />
            <span>Pacific Rim National Park Reserve</span>
          </div>
          <div className="auth-visual-card">
            <p>Featured Story</p>
            <strong>Road Through the Forest</strong>
            <small><IoCarSportOutline aria-hidden="true" /> 2001 Ford Econoline 150</small>
          </div>
          <img
            src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1400&q=80"
            alt="Abstract immersive visual"
          />
          <div className="auth-visual-copy">
            <h2>Your next reading adventure starts here.</h2>
            <p>Discover standout authors, memorable books, and experiences curated for you.</p>
            <div className="auth-visual-tags">
              <span><FaCircle className="dot dot-red" aria-hidden="true" /> Destinations</span>
              <span><FaCircle className="dot dot-yellow" aria-hidden="true" /> Authors</span>
              <span><FaCircle className="dot dot-blue" aria-hidden="true" /> Books</span>
              <span><FaCircle className="dot dot-green" aria-hidden="true" /> Events</span>
            </div>
          </div>
        </aside>

        <div className="auth-page-panel">
          <div className="auth-panel-top">
            <div className="auth-top-left">
              <a className="auth-icon-btn" href="/" aria-label="Back to home">
                <FaChevronLeft aria-hidden="true" />
              </a>
              <span className="auth-menu-pill">
                <HiMiniSquares2X2 aria-hidden="true" />
                <span>Menu</span>
              </span>
            </div>
            <span className="auth-location-pill">
              <FaLocationDot aria-hidden="true" />
              <span>Canada 🇨🇦</span>
            </span>
          </div>

          {!user ? (
            <>
              <div className="auth-intro">
                <div className="auth-mark">
                  <BsStars aria-hidden="true" />
                </div>
                <h1>Join Spotlight Surge</h1>
                <p>This is the start of something good.</p>
              </div>

              <div className="auth-segmented" role="tablist" aria-label="Auth mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signup"}
                  className={mode === "signup" ? "active" : ""}
                  onClick={() => setMode("signup")}
                >
                  Register
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "login"}
                  className={mode === "login" ? "active" : ""}
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </div>

              <div className="auth-socials auth-socials-round">
                <button className="auth-social-circle" type="button" onClick={() => startSocial("facebook")}>
                  <FaFacebookF aria-hidden="true" />
                </button>
                <button className="auth-social-circle" type="button" disabled aria-label="Apple sign in coming soon">
                  <FaApple aria-hidden="true" />
                </button>
                <button className="auth-social-circle" type="button" onClick={() => startSocial("google")}>
                  <FaGoogle aria-hidden="true" />
                </button>
              </div>

              <div className="auth-divider"><span>or</span></div>

              <form className="auth-page-form" onSubmit={onSubmit}>
                {mode === "signup" ? (
                  <label>
                    Full Name
                    <input name="name" value={form.name} onChange={onChange} required />
                  </label>
                ) : null}

                <label>
                  Email Address
                  <input name="email" type="email" value={form.email} onChange={onChange} required />
                </label>

                <label>
                  Password
                  <div className="auth-password-wrap">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={onChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaRegEyeSlash aria-hidden="true" /> : <FaRegEye aria-hidden="true" />}
                    </button>
                  </div>
                </label>

                {mode === "signup" ? (
                  <>
                    <div className="auth-account-picker" role="group" aria-label="Account Type">
                      <span className="auth-picker-label">Account Type</span>
                      <div className="auth-picker-options">
                        <button
                          type="button"
                          className={form.accountType === "reader" ? "active" : ""}
                          onClick={() => setForm((current) => ({ ...current, accountType: "reader" }))}
                        >
                          Reader
                          <small>Discover and follow authors</small>
                        </button>
                        <button
                          type="button"
                          className={form.accountType === "author" ? "active" : ""}
                          onClick={() => setForm((current) => ({ ...current, accountType: "author" }))}
                        >
                          Author
                          <small>Share books and grow audience</small>
                        </button>
                      </div>
                    </div>

                    <label className="auth-terms">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(event) => setAgreeTerms(event.target.checked)}
                      />
                      <span>I agree to the Terms & Conditions</span>
                    </label>
                  </>
                ) : (
                  <label className="auth-terms">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                )}

                <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
                  {loading ? "Please wait..." : mode === "signup" ? "Start your adventure" : "Login"}
                </button>
              </form>
            </>
          ) : isReader ? (
            <form className="auth-page-form" onSubmit={onUpgrade}>
              <h2>Upgrade to Author</h2>
              <p className="auth-note">One-way change. You cannot revert to ordinary reader.</p>
              <label>
                Author Bio
                <textarea name="bio" value={upgrade.bio} onChange={onUpgradeChange} />
              </label>
              <label>
                Website
                <input name="website" value={upgrade.website} onChange={onUpgradeChange} />
              </label>
              <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
                {loading ? "Upgrading..." : "Upgrade to Author"}
              </button>
            </form>
          ) : isAuthor ? (
            <div className="auth-note auth-note-success">
              Your account is author-enabled and includes all reader features.
            </div>
          ) : null}

          {!user ? (
            <p className="auth-subline">
              Prefer social login? Use the quick buttons above.
            </p>
          ) : (
            <div className="auth-user-inline">
              <p>
                Signed in as <strong>{user.name}</strong> ({user.role})
              </p>
              <button className="btn btn-secondary" type="button" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}

          {status.message ? (
            <p className={`auth-status ${status.type === "error" ? "error" : "success"}`}>
              {status.message}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
