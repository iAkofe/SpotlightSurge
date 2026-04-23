"use client";

import { useEffect, useMemo, useState } from "react";
import "./CommentsWidget.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

function formatDate(value) {
  try {
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "";
  }
}

export default function CommentsWidget({ targetType, targetId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setStatus({ type: "", message: "" });
      try {
        const endpoint =
          targetType === "book" ? `/api/books/${targetId}/comments` : `/api/posts/${targetId}/comments`;
        const response = await fetch(`${API_BASE}${endpoint}`, { cache: "no-store" });
        const data = await parseJson(response);
        if (!response.ok) {
          throw new Error(data?.error || "Failed to load comments.");
        }
        if (!cancelled) {
          setComments(Array.isArray(data?.comments) ? data.comments : []);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({ type: "error", message: error.message });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [targetType, targetId]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateAuth() {
      const refreshed = await refreshSession();
      if (!cancelled && refreshed?.accessToken) {
        setToken(refreshed.accessToken);
      }
    }

    hydrateAuth().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const refreshed = token ? { accessToken: token } : await refreshSession();
      if (!refreshed?.accessToken) {
        throw new Error("Please sign in to leave a comment.");
      }
      if (!token) {
        setToken(refreshed.accessToken);
      }

      const endpoint =
        targetType === "book" ? `/api/books/${targetId}/comments` : `/api/posts/${targetId}/comments`;
      const payload = { content };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
          Authorization: `Bearer ${refreshed.accessToken}`
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = await parseJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit comment.");
      }

      setComments((current) => [data.comment, ...current]);
      setContent("");
      setStatus({ type: "success", message: "Thanks for your feedback!" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="comments-widget" aria-label="Comments">
      <header className="comments-head">
        <div>
          <h2>Comments</h2>
          <p>{comments.length ? `${comments.length} total` : "Be the first to share your thoughts."}</p>
        </div>
      </header>

      <form className="comments-form" onSubmit={submit}>
        <label className="comments-field">
          <span>Your message</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write a comment..."
            minLength={2}
            maxLength={2000}
            required
          />
        </label>

        <div className="comments-actions">
          <button className="comments-submit" type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </button>
          <a className="comments-auth-link" href="/auth?mode=login">
            Sign in
          </a>
        </div>
      </form>

      {status.message ? <p className={`comments-status ${status.type}`}>{status.message}</p> : null}

      <div className="comments-list" aria-busy={loading}>
        {loading ? <p className="comments-empty">Loading...</p> : null}

        {!loading && comments.length === 0 ? <p className="comments-empty">No comments yet.</p> : null}

        {comments.map((comment) => (
          <article key={comment.id} className="comment-card">
            <div className="comment-meta">
              <div className="comment-user">
                <span className="comment-avatar">
                  {comment.user?.profileImageUrl ? (
                    <img src={comment.user.profileImageUrl} alt={comment.user?.name || "User"} />
                  ) : (
                    <span>{(comment.user?.name || "U").slice(0, 1).toUpperCase()}</span>
                  )}
                </span>
                <div>
                  <strong>{comment.user?.name || "Reader"}</strong>
                  <time>{formatDate(comment.createdAt)}</time>
                </div>
              </div>
            </div>
            <p className="comment-body">{comment.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
