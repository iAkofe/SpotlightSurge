"use client";

import { useEffect, useMemo, useState } from "react";
import "./PostLikeButton.css";

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

export default function PostLikeButton({ postId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(Number(initialLikes) || 0);
  const [token, setToken] = useState("");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const refreshed = await refreshSession();
      if (!cancelled && refreshed?.accessToken) {
        setToken(refreshed.accessToken);
      }
    }
    hydrate().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle() {
    setLoading(true);
    setError("");

    try {
      const refreshed = token ? { accessToken: token } : await refreshSession();
      if (!refreshed?.accessToken) {
        throw new Error("Sign in to like posts.");
      }
      if (!token) {
        setToken(refreshed.accessToken);
      }

      const response = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          ...authHeaders,
          Authorization: `Bearer ${refreshed.accessToken}`
        },
        credentials: "include"
      });

      const data = await parseJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "Could not update like.");
      }

      setLiked(Boolean(data.liked));
      setLikes(typeof data.likesCount === "number" ? data.likesCount : likes);
    } catch (issue) {
      setError(issue.message || "Could not update like.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="post-like">
      <button className={`post-like-btn ${liked ? "liked" : ""}`} type="button" onClick={toggle} disabled={loading}>
        <span className="heart" aria-hidden="true">
          ♥
        </span>
        <span>{liked ? "Liked" : "Like"}</span>
        <span className="count">{likes}</span>
      </button>
      {error ? <span className="post-like-error">{error}</span> : null}
    </div>
  );
}

