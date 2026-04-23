"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaApple,
  FaGoogle,
  FaRegEye,
  FaRegEyeSlash
} from "../Icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function readErrorMessage(error) {
  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
    return `Cannot reach the API at ${API_BASE}. Start the backend on port 4000 and make sure PostgreSQL is running on localhost:5432.`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Request failed.";
}

async function parseJson(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

async function refreshSession() {
  const response = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });

  const data = await parseJson(response);
  if (!response.ok) {
    return null;
  }

  return data;
}

function getInitialMode() {
  if (typeof window === "undefined") {
    return "login";
  }

  const params = new URLSearchParams(window.location.search);
  return params.get("mode") === "signup" ? "signup" : "login";
}

function syncMode(mode) {
  const params = new URLSearchParams(window.location.search);
  params.set("mode", mode);
  window.history.replaceState({}, "", `/auth?${params.toString()}`);
}

function getAuthVisual(mode) {
  if (mode === "signup") {
    return {
      title: "Join a community of storytellers",
      body: "Whether you write or read, SpotlightSurge brings literary minds together."
    };
  }

  return {
    title: "Share your story with the world",
    body: "Connect with readers, showcase your books, and grow your audience on SpotlightSurge."
  };
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "author"
  });
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [upgrade, setUpgrade] = useState({ bio: "", website: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const visual = getAuthVisual(mode);
  const isReader = user?.role === "READER";

  useEffect(() => {
    setMode(getInitialMode());

    async function restoreFromCookies() {
      const params = new URLSearchParams(window.location.search);
      const socialError = params.get("error");
      const oauthSuccess = params.get("oauth") === "success";

      if (socialError) {
        setStatus({ type: "error", message: socialError });
        params.delete("error");
      }

      if (oauthSuccess) {
        setStatus({ type: "success", message: "Social login successful." });
        params.delete("oauth");
      }

      window.history.replaceState({}, "", `/auth?${params.toString() || "mode=login"}`);

      const refreshed = await refreshSession();
      if (refreshed?.accessToken) {
        setToken(refreshed.accessToken);
        setUser(refreshed.user || null);
      }
    }

    restoreFromCookies().catch((error) => {
      setStatus({ type: "error", message: readErrorMessage(error) });
    });
  }, []);

  useEffect(() => {
    syncMode(mode);
  }, [mode]);

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

        const data = await parseJson(response);
        setUser(data.user);
      } catch (error) {
        setStatus({ type: "error", message: readErrorMessage(error) });
        setToken("");
      }
    }

    fetchMe();
  }, [token, authHeaders]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role === "AUTHOR" || user.role === "ADMIN") {
      window.location.replace("/dashboard/author");
    }
  }, [user]);

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

      const data = await parseJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "Request failed.");
      }

      setToken(data.accessToken);
      setUser(data.user);
      setStatus({
        type: "success",
        message: mode === "signup" ? "Account created successfully." : `Welcome back, ${data.user.name}.`
      });
    } catch (error) {
      setStatus({ type: "error", message: readErrorMessage(error) });
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

      const data = await parseJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "Upgrade failed.");
      }

      setUser(data.user);
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({ type: "error", message: readErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }

  async function onLogout() {
    setLoading(true);

    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setToken("");
      setUser(null);
      setLoading(false);
    }
  }

  function startSocial(provider) {
    window.location.href = `${API_BASE}/api/auth/oauth/${provider}`;
  }

  return (
    <main className={`auth-page-main auth-mode-${mode}`}>
      <section className="auth-page-shell" aria-label="Authentication">
        <aside className="auth-visual-panel">
          <a className="auth-brand" href="/">
            <span className="auth-brand-mark">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <path d="M8 8.5h3.8c1.1 0 2 .9 2 2V16H10c-1.1 0-2-.9-2-2V8.5Z" />
                <path d="M16 8.5h-3.8c-1.1 0-2 .9-2 2V16H14c1.1 0 2-.9 2-2V8.5Z" />
              </svg>
            </span>
            <span>SpotlightSurge</span>
          </a>

          <div className="auth-visual-copy">
            <h2>{visual.title}</h2>
            <p>{visual.body}</p>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <a className="auth-brand auth-brand-mobile" href="/">
              <span className="auth-brand-mark">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                  <path d="M8 8.5h3.8c1.1 0 2 .9 2 2V16H10c-1.1 0-2-.9-2-2V8.5Z" />
                  <path d="M16 8.5h-3.8c-1.1 0-2 .9-2 2V16H14c1.1 0 2-.9 2-2V8.5Z" />
                </svg>
              </span>
              <span>SpotlightSurge</span>
            </a>

            {!user ? (
              <>
                <div className="auth-heading">
                  <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
                  <p>
                    {mode === "signup"
                      ? "Start your journey on SpotlightSurge"
                      : "Sign in to your author dashboard"}
                  </p>
                </div>

                {mode === "signup" ? (
                  <div className="auth-account-toggle" role="group" aria-label="Account Type">
                    <button
                      type="button"
                      className={form.accountType === "reader" ? "active" : ""}
                      onClick={() => setForm((current) => ({ ...current, accountType: "reader" }))}
                    >
                      I&apos;m a Reader
                    </button>
                    <button
                      type="button"
                      className={form.accountType === "author" ? "active" : ""}
                      onClick={() => setForm((current) => ({ ...current, accountType: "author" }))}
                    >
                      I&apos;m an Author
                    </button>
                  </div>
                ) : null}

                <form className="auth-form" onSubmit={onSubmit}>
                  {mode === "signup" ? (
                    <label>
                      <span>Full Name</span>
                      <input
                        name="name"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={onChange}
                        required
                      />
                    </label>
                  ) : null}

                  <label>
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={onChange}
                      required
                    />
                  </label>

                  <label>
                    <span className="auth-password-label">
                      Password
                      {mode === "login" ? <button type="button">Forgot password?</button> : null}
                    </span>
                    <div className="auth-password-wrap">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
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
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                  </label>

                  <button className="auth-submit" type="submit" disabled={loading}>
                    {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
                  </button>
                </form>

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                <div className="auth-socials">
                  <button type="button" className="auth-social-btn" onClick={() => startSocial("google")}>
                    <FaGoogle />
                    <span>Google</span>
                  </button>
                  <button type="button" className="auth-social-btn" disabled>
                    <FaApple />
                    <span>Apple</span>
                  </button>
                </div>

                <p className="auth-switch-copy">
                  {mode === "signup" ? "Already have an account?" : "Don’t have an account?"}{" "}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => setMode((current) => (current === "signup" ? "login" : "signup"))}
                  >
                    {mode === "signup" ? "Sign in" : "Create one"}
                  </button>
                </p>
              </>
            ) : isReader ? (
              <form className="auth-form auth-upgrade-card" onSubmit={onUpgrade}>
                <div className="auth-heading">
                  <h1>Upgrade to author</h1>
                  <p>Your reader account is active. Add your author details to unlock the dashboard.</p>
                </div>

                <label>
                  <span>Short Bio</span>
                  <textarea
                    name="bio"
                    placeholder="Tell readers about your writing"
                    value={upgrade.bio}
                    onChange={onUpgradeChange}
                  />
                </label>

                <label>
                  <span>Website</span>
                  <input
                    name="website"
                    placeholder="https://yourwebsite.com"
                    value={upgrade.website}
                    onChange={onUpgradeChange}
                  />
                </label>

                <button className="auth-submit" type="submit" disabled={loading}>
                  {loading ? "Upgrading..." : "Upgrade to Author"}
                </button>

                <button className="auth-secondary-action" type="button" onClick={onLogout}>
                  Logout
                </button>
              </form>
            ) : null}

            {status.message ? (
              <p className={`auth-status ${status.type === "error" ? "error" : "success"}`}>
                {status.message}
              </p>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
