"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Edit3,
  Globe,
  MapPin,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import "./AuthorProfile.css";
import "../Archive/Archive-extra.css";

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
    return (
      <main className="author-profile-page">
        <div className="profile-loading">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading author profile...
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="author-profile-page">
        <div className="profile-loading">{error}</div>
      </main>
    );
  }

  const { author, books, posts, stats } = data;

  return (
    <main className="author-profile-page">
      <header className="author-profile-topbar">
        <div className="profile-container topbar-inner">
          <a className="author-profile-brand" href="/">
            <div className="brand-mark">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <path d="M8 8.5h3.8c1.1 0 2 .9 2 2V16H10c-1.1 0-2-.9-2-2V8.5Z" />
                <path d="M16 8.5h-3.8c-1.1 0-2 .9-2 2V16H14c1.1 0 2-.9 2-2V8.5Z" />
              </svg>
            </div>
            <span>SpotlightSurge</span>
          </a>
          <a className="author-profile-signin" href="/auth?mode=login">Sign In</a>
        </div>
      </header>

      <section className="author-hero">
        <div className="author-hero-bg" />
        <div className="profile-container hero-inner">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="author-avatar-wrapper"
          >
            <div className="author-avatar">
              {author.profileImageUrl ? (
                <img src={author.profileImageUrl} alt={author.name} />
              ) : (
                <span className="avatar-initials">{getInitials(author.name)}</span>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="author-hero-content"
          >
            <h1>{author.name}</h1>
            <p className="author-bio">{author.bio || "Author profile coming soon."}</p>
            <div className="author-meta-tags">
              {author.location && (
                <span className="meta-tag">
                  <MapPin size={16} /> {author.location}
                </span>
              )}
              {author.website && (
                <a className="meta-tag link" href={author.website} target="_blank" rel="noreferrer">
                  <Globe size={16} /> Website
                </a>
              )}
              <span className="meta-tag solid">{stats.books} Books</span>
              <span className="meta-tag solid">{stats.posts} Posts</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="profile-container">
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="author-section"
        >
          <div className="section-header">
            <h2>Published Books</h2>
            <span className="section-count">{books.length}</span>
          </div>

          <div className="author-book-grid">
            {books.map((book, i) => (
              <motion.article 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="profile-book-card" 
                key={book.id}
              >
                <div className="profile-book-cover">
                  {book.coverImageUrl ? (
                    <img src={book.coverImageUrl} alt={book.title} />
                  ) : (
                    <div className="book-cover-placeholder">
                      <BookOpen size={32} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="profile-book-info">
                  <span className="book-genre">{book.genre || "Book"}</span>
                  <h3>{book.title}</h3>
                  <p>{book.description || "No description provided yet."}</p>
                  
                  {book.snippet ? (
                    <div className="book-actions-group">
                      <a className="book-read-link" href={`/books/${book.id}`} target="_blank" rel="noreferrer">
                        Read Snippet <ArrowRight size={16} />
                      </a>
                      {book.purchaseLink && (
                        <a className="book-buy-link" href={book.purchaseLink} target="_blank" rel="noreferrer">
                          Buy Book <Globe size={14} />
                        </a>
                      )}
                    </div>
                  ) : (
                    <a className="book-read-link" href={book.bookFileUrl} target="_blank" rel="noreferrer">
                      Read Full Book <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}

            {books.length === 0 && (
              <div className="empty-state">
                <BookOpen size={32} className="empty-icon" />
                <h3>No books published</h3>
                <p>This author hasn't added any books yet.</p>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="author-section"
        >
          <div className="section-header">
            <h2>Recent Posts</h2>
            <span className="section-count">{posts.length}</span>
          </div>

          <div className="author-post-grid">
            {posts.map((post, i) => (
              <motion.article 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="profile-post-card" 
                key={post.id}
                role="link"
                tabIndex={0}
                onClick={() => window.location.assign(`/posts/${post.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    window.location.assign(`/posts/${post.id}`);
                  }
                }}
              >
                {post.coverImage && (
                  <div className="profile-post-cover">
                    <img src={post.coverImage} alt={post.title} />
                  </div>
                )}
                <div className="profile-post-content">
                  <div className="post-date">{formatDate(post.createdAt)}</div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt || post.content.slice(0, 120)}</p>
                  <div className="post-footer">
                    <span className="post-comments">
                      <MessageCircle size={16} />
                      {Math.max(0, post.content.length % 32)} Comments
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}

            {posts.length === 0 && (
              <div className="empty-state">
                <Edit3 size={32} className="empty-icon" />
                <h3>No posts yet</h3>
                <p>Recent writing updates will appear here.</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
