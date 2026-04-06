"use client";

import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiEdit3,
  FiGlobe,
  FiMapPin,
  FiMessageCircle
} from "../Icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return "";
  }
}

function getInitials(name) {
  return (name || "AD")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AuthorProfile({ authorId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/api/authors/${authorId}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Failed to load author profile.");
        }
        setData(payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authorId]);

  if (loading) {
    return <main className="author-profile-page"><p className="dashboard-loading">Loading author profile...</p></main>;
  }

  if (error) {
    return <main className="author-profile-page"><p className="dashboard-loading">{error}</p></main>;
  }

  const { author, books, posts, stats } = data;

  return (
    <main className="author-profile-page">
      <section className="author-profile-shell">
        <header className="author-profile-topbar">
          <a className="author-profile-brand" href="/">
            <span className="dashboard-brand-mark">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <path d="M8 8.5h3.8c1.1 0 2 .9 2 2V16H10c-1.1 0-2-.9-2-2V8.5Z" />
                <path d="M16 8.5h-3.8c-1.1 0-2 .9-2 2V16H14c1.1 0 2-.9 2-2V8.5Z" />
              </svg>
            </span>
            <span>SpotlightSurge</span>
          </a>
          <a className="author-profile-signin" href="/auth?mode=login">Sign In</a>
        </header>

        <section className="author-profile-hero">
          <div className="author-profile-avatar">
            {author.profileImageUrl ? <img src={author.profileImageUrl} alt={author.name} /> : getInitials(author.name)}
          </div>
          <div className="author-profile-copy">
            <h1>{author.name}</h1>
            <p>{author.bio || "Author profile coming soon."}</p>
            <div className="author-profile-meta">
              {author.location ? <span><FiMapPin /> {author.location}</span> : null}
              {author.website ? (
                <a href={author.website} target="_blank" rel="noreferrer">
                  <FiGlobe />
                  <span>Website</span>
                </a>
              ) : null}
              <span>{stats.books} books</span>
              <span>{stats.posts} posts</span>
            </div>
          </div>
        </section>

        <section className="author-profile-section">
          <h2>Books</h2>
          <div className="author-profile-book-grid">
            {books.map((book) => (
              <article className="author-public-book-card" key={book.id}>
                <div className="author-public-book-cover">
                  {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} /> : <FiBookOpen />}
                </div>
                <div className="author-public-book-body">
                  <h3>{book.title}</h3>
                  <p>{book.description || "No description provided yet."}</p>
                  <div className="author-public-book-footer">
                    <span>{book.genre || "Book"}</span>
                    <a href={book.bookFileUrl} target="_blank" rel="noreferrer">Read</a>
                  </div>
                </div>
              </article>
            ))}

            {books.length === 0 ? (
              <article className="dashboard-inline-empty">
                <h3>No books published yet</h3>
                <p>This author has not added any books yet.</p>
              </article>
            ) : null}
          </div>
        </section>

        <section className="author-profile-section">
          <h2>Posts</h2>
          <div className="author-public-posts">
            {posts.map((post) => (
              <article className="author-public-post-row" key={post.id}>
                <div className="dashboard-list-icon"><FiEdit3 /></div>
                <div className="author-public-post-copy">
                  <h3>{post.title}</h3>
                  <p>{formatDate(post.createdAt)}</p>
                </div>
                <span className="author-public-post-comments">
                  <FiMessageCircle />
                  <span>{Math.max(0, post.content.length % 32)}</span>
                </span>
              </article>
            ))}

            {posts.length === 0 ? (
              <article className="dashboard-inline-empty">
                <h3>No posts published yet</h3>
                <p>Recent writing updates will appear here.</p>
              </article>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
