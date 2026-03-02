"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AuthPage() {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "reader",
    bio: "",
    website: ""
  });
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [upgrade, setUpgrade] = useState({ bio: "", website: "" });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const isReader = user?.role === "READER";
  const isAuthor = user?.role === "AUTHOR" || user?.role === "ADMIN";

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
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
              accountType: form.accountType,
              bio: form.accountType === "author" ? form.bio : "",
              website: form.accountType === "author" ? form.website : ""
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
          <img
            src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1400&q=80"
            alt="Abstract immersive visual"
          />
        </aside>

        <div className="auth-page-panel">
          <a className="auth-back" href="/">← Back to home</a>
          <h1>{mode === "signup" ? "Create an Account" : "Login"}</h1>

          {!user ? (
            <p className="auth-subline">
              {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
              <button
                type="button"
                className="auth-inline-switch"
                onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              >
                {mode === "signup" ? "Log in" : "Create one"}
              </button>
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

          {!user ? (
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
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </label>

              {mode === "signup" ? (
                <>
                  <label>
                    Account Type
                    <select name="accountType" value={form.accountType} onChange={onChange}>
                      <option value="reader">Reader</option>
                      <option value="author">Author</option>
                    </select>
                  </label>

                  {form.accountType === "author" ? (
                    <>
                      <label>
                        Author Bio
                        <textarea name="bio" value={form.bio} onChange={onChange} />
                      </label>
                      <label>
                        Website
                        <input name="website" value={form.website} onChange={onChange} />
                      </label>
                    </>
                  ) : null}

                  <label className="auth-terms">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(event) => setAgreeTerms(event.target.checked)}
                    />
                    <span>I agree to the Terms & Conditions</span>
                  </label>
                </>
              ) : null}

              <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
              </button>
            </form>
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
            <>
              <div className="auth-divider"><span>or</span></div>
              <div className="auth-socials">
                <button className="auth-social-btn" type="button" onClick={() => startSocial("google")}>
                  Continue with Google
                </button>
                <button className="auth-social-btn" type="button" onClick={() => startSocial("facebook")}>
                  Continue with Facebook
                </button>
              </div>
            </>
          ) : null}

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
