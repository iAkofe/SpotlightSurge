"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiMenu,
  FiPlus,
  FiSearch,
  FiTrendingUp
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

  const cardPool = useMemo(() => {
    if (!data) {
      return [];
    }

    const postCards = (data.posts || []).map((post) => ({
      id: post.id,
      title: post.title,
      category: post.category || "#Featured",
      date: formatDate(post.createdAt),
      body: post.excerpt || post.content?.slice(0, 110) || "",
      image: post.coverImage || ""
    }));

    const bookCards = (data.books || []).map((book) => ({
      id: `book-${book.id}`,
      title: book.title,
      category: `#${book.genre || "Book"}`,
      date: formatDate(book.createdAt),
      body: book.description || "Newly added title by this author.",
      image: book.coverImageUrl || ""
    }));

    return [...postCards, ...bookCards].slice(0, 4);
  }, [data]);

  if (loading) {
    return <main className="author-profile-page"><p>Loading author profile...</p></main>;
  }

  if (error) {
    return <main className="author-profile-page"><p>{error}</p></main>;
  }

  const { author, books, posts, stats } = data;
  const followerCount = Math.max(26, stats.posts * 4 + stats.books * 3 + 14);
  const followingCount = Math.max(12, Math.floor(followerCount / 4));
  const readCount = Math.max(12, Math.round(stats.posts * 1.35));
  const savedCount = Math.max(18, Math.round(stats.posts * 1.6 + stats.books));

  return (
    <main className="author-profile-page">
      <section className="author-profile-frame">
        <header className="profile-topbar">
          <div className="top-brand">
            <img src="/logo.png" alt="Spotlight Surge" />
          </div>
          <button className="top-profile" type="button">My Profile <FiMenu /></button>
          <button className="top-write" type="button"><FiPlus /> Write</button>
        </header>

        <div className="pro-strip"><span>PRO</span> Upgrade for full access beyond the 4 latest apps - Get Pro</div>

        <section className="profile-hero">
          <div className="hero-identity">
            <img src={author.profileImageUrl || "https://placehold.co/120x120?text=Author"} alt={author.name} />
            <div>
              <h1>{author.name} <FiEdit2 /></h1>
              <p>{followerCount} Followers&nbsp;&nbsp; {followingCount} Following</p>
              <div className="badge-row">
                <span>🏆 Top Contributor</span>
                <span>✍️ Book Author</span>
                <span>✨ Rising Voice</span>
                <span>🔎 Thought Leader</span>
                <span>🌿 Creative Voice</span>
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <article className="mini-stat read">
              <p>Read</p>
              <span>-9%</span>
              <strong>{readCount}</strong>
            </article>
            <article className="mini-stat published">
              <p>Published</p>
              <span>-9%</span>
              <strong>{stats.posts}</strong>
            </article>
            <article className="mini-stat saved">
              <p>Saved</p>
              <span><FiTrendingUp /> 4%</span>
              <strong>{savedCount}</strong>
            </article>
          </div>
        </section>

        <section className="profile-content-grid">
          <aside className="insights-panel">
            <h2>Audience Insights</h2>
            <p className="insight-note">A quick look at what&apos;s been vibin lately. Updated hourly</p>

            <article className="insight-card">
              <h3>Top age ranges</h3>
              <div className="bar-group">
                <label>18-24</label>
                <div><span style={{ width: "79%" }}></span></div>
                <strong>79.08%</strong>
              </div>
              <div className="bar-group">
                <label>25-30</label>
                <div><span style={{ width: "65%" }}></span></div>
                <strong>65.20%</strong>
              </div>
              <div className="bar-group">
                <label>31-45</label>
                <div><span style={{ width: "48%" }}></span></div>
                <strong>48.67%</strong>
              </div>
            </article>

            <article className="insight-card">
              <h3>Top location</h3>
              <div className="line-group"><label>Nigeria</label><span>79.08%</span></div>
              <div className="line-group"><label>UK</label><span>57.12%</span></div>
              <div className="line-group"><label>Canada</label><span>42.56%</span></div>
            </article>

            <article className="insight-device">
              <p>Top Reader Device</p>
              <div>
                <span>Mobile</span>
                <strong>72%</strong>
              </div>
            </article>
          </aside>

          <section className="posts-panel">
            <div className="posts-head">
              <h2>Recent Posts</h2>
              <div className="posts-tabs">
                <button className="active" type="button">Published</button>
                <button type="button">Saved</button>
                <button type="button">Archived</button>
              </div>
            </div>

            <div className="posts-grid">
              {cardPool.length === 0 ? (
                <article className="post-card empty">
                  <h3>No content yet</h3>
                  <p>This author has not published posts or books yet.</p>
                </article>
              ) : (
                cardPool.map((card, index) => (
                  <article className="post-card" key={card.id}>
                    <div className="post-meta-head">
                      <p>{card.category}</p>
                      <span>{card.date}</span>
                    </div>

                    <div className={`post-image theme-${index % 4}`}>
                      {card.image ? <img src={card.image} alt={card.title} /> : null}
                    </div>

                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>

        <footer className="profile-footer">
          <div className="footer-brand">
            <h3>
              <img src="/logo.png" alt="Spotlight Surge" />
            </h3>
            <p>Your daily dose of culture, trends, and beyond.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <p>About</p>
            <p>Contact</p>
            <p>Archive</p>
          </div>
          <div>
            <h4>Social</h4>
            <p>Instagram</p>
            <p>Facebook</p>
            <p>X (Twitter)</p>
          </div>
          <div>
            <h4>Topics</h4>
            <p>Sports</p>
            <p>Technology</p>
            <p>Finance</p>
          </div>
          <div>
            <h4>Genres</h4>
            <p>New Releases</p>
            <p>Nostalgia</p>
            <p>Recommended</p>
          </div>
        </footer>
      </section>
    </main>
  );
}
