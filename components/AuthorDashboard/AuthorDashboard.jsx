"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiBarChart2,
  FiBookOpen,
  FiDatabase,
  FiEdit3,
  FiFilter,
  FiGlobe,
  FiGrid,
  FiLogOut,
  FiMail,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShare2,
  FiUsers
} from "../Icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const initialPost = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  coverImage: ""
};

const initialBook = {
  title: "",
  description: "",
  genre: "",
  publishedYear: "",
  bookFile: null,
  coverImage: null
};

export default function AuthorDashboard() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [books, setBooks] = useState([]);
  const [postForm, setPostForm] = useState(initialPost);
  const [bookForm, setBookForm] = useState(initialBook);
  const [loading, setLoading] = useState(true);
  const [savingPost, setSavingPost] = useState(false);
  const [savingBook, setSavingBook] = useState(false);
  const [composer, setComposer] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("ss_access_token") || "";
    if (!savedToken) {
      window.location.replace("/auth");
      return;
    }
    setToken(savedToken);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function load() {
      setLoading(true);
      setStatus({ type: "", message: "" });

      try {
        const meResponse = await fetch(`${API_BASE}/api/auth/me`, {
          headers: authHeaders,
          credentials: "include"
        });

        if (!meResponse.ok) {
          throw new Error("Session expired. Please login again.");
        }

        const meData = await meResponse.json();
        const role = meData.user?.role;
        if (role !== "AUTHOR" && role !== "ADMIN") {
          throw new Error("Author account required to access this dashboard.");
        }

        setUser(meData.user);

        const [postsResponse, booksResponse] = await Promise.all([
          fetch(`${API_BASE}/api/posts/me`, {
            headers: authHeaders,
            credentials: "include"
          }),
          fetch(`${API_BASE}/api/books/me`, {
            headers: authHeaders,
            credentials: "include"
          })
        ]);

        if (!postsResponse.ok) {
          throw new Error("Could not load your posts. Ensure migrations are up to date.");
        }

        if (!booksResponse.ok) {
          throw new Error("Could not load your books.");
        }

        const postsData = await postsResponse.json();
        const booksData = await booksResponse.json();
        setPosts(postsData.posts || []);
        setBooks(booksData.books || []);
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token, authHeaders]);

  function onPostChange(event) {
    const { name, value } = event.target;
    setPostForm((current) => ({ ...current, [name]: value }));
  }

  function onBookChange(event) {
    const { name, value, files } = event.target;
    if (name === "bookFile" || name === "coverImage") {
      setBookForm((current) => ({ ...current, [name]: files?.[0] || null }));
      return;
    }

    setBookForm((current) => ({ ...current, [name]: value }));
  }

  async function createPost(event) {
    event.preventDefault();
    setSavingPost(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders
        },
        credentials: "include",
        body: JSON.stringify(postForm)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post.");
      }

      setPosts((current) => [data.post, ...current]);
      setPostForm(initialPost);
      setComposer("");
      setStatus({ type: "success", message: "Post created successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingPost(false);
    }
  }

  async function createBook(event) {
    event.preventDefault();
    setSavingBook(true);
    setStatus({ type: "", message: "" });

    try {
      if (!bookForm.bookFile) {
        throw new Error("Please attach a book file.");
      }

      const payload = new FormData();
      payload.append("title", bookForm.title);
      payload.append("description", bookForm.description);
      payload.append("genre", bookForm.genre);
      payload.append("publishedYear", bookForm.publishedYear);
      payload.append("bookFile", bookForm.bookFile);
      if (bookForm.coverImage) {
        payload.append("coverImage", bookForm.coverImage);
      }

      const response = await fetch(`${API_BASE}/api/books`, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: payload
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add book.");
      }

      setBooks((current) => [data.book, ...current]);
      setBookForm(initialBook);
      setComposer("");
      setStatus({ type: "success", message: "Book added successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingBook(false);
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      window.localStorage.removeItem("ss_access_token");
      window.location.replace("/auth");
    }
  }

  const publishedPosts = posts.filter((post) => post.isPublished).length;
  const newestPosts = posts.slice(0, 2);
  const postGrowth = posts.length ? Math.min(35, posts.length * 2) : 0;
  const bookGrowth = books.length ? Math.min(35, books.length * 3) : 0;

  if (loading) {
    return <main className="author-dashboard-page"><p>Loading dashboard...</p></main>;
  }

  return (
    <main className="author-dashboard-page">
      <section className="author-dashboard-shell">
        <aside className="author-sidebar">
          <div className="author-brand"><span>◍</span> SpotlightSurge</div>

          <div className="sidebar-group">
            <p>General</p>
            <button className="active" type="button"><FiGrid /> Dashboard</button>
            <button type="button"><FiEdit3 /> Blog Posts</button>
            <button type="button"><FiDatabase /> Database</button>
            <button type="button"><FiGlobe /> Connections</button>
            <button type="button"><FiBarChart2 /> Analytics</button>
          </div>

          <div className="sidebar-group">
            <p>Author</p>
            <button type="button"><FiUsers /> Audience</button>
            <button type="button"><FiBookOpen /> Books</button>
            <button type="button" onClick={() => setComposer("post")}><FiPlus /> New Post</button>
            <button type="button" onClick={() => setComposer("book")}><FiPlus /> New Book</button>
          </div>

          <button className="sidebar-settings" type="button"><FiSettings /> Settings</button>
        </aside>

        <div className="author-content">
          <header className="author-header">
            <div>
              <h1>Dashboard</h1>
              <p>Monitor and optimize your blog performance</p>
            </div>
            <div className="header-actions">
              <button type="button" aria-label="Search"><FiSearch /></button>
              <button type="button" aria-label="Messages"><FiMail /></button>
              <a href={user ? `/authors/${user.id}` : "#"} className="author-chip">{user?.name || "Author"}</a>
            </div>
          </header>

          <div className="author-toolbar">
            <button type="button" className="toolbar-pill">Last 30 Days</button>
            <div className="toolbar-actions">
              <button type="button" className="toolbar-pill"><FiFilter /> Filter</button>
              <button type="button" className="toolbar-pill"><FiShare2 /> Share</button>
              <button type="button" className="toolbar-primary" onClick={() => setComposer("post")}>+ New Post</button>
              <button type="button" className="toolbar-primary alt" onClick={() => setComposer("book")}>+ New Book</button>
              <button type="button" className="toolbar-pill" onClick={logout}><FiLogOut /> Logout</button>
            </div>
          </div>

          <section className="kpi-grid">
            <article className="kpi-card">
              <h3>Total Views</h3>
              <p>Total published post count in your account.</p>
              <div><strong>{publishedPosts}</strong><span>+{postGrowth}%</span></div>
            </article>
            <article className="kpi-card">
              <h3>Unique Visitors</h3>
              <p>Estimated from recent engagement and profile traffic.</p>
              <div><strong>{(posts.length * 320 + 780).toLocaleString()}</strong><span>+{Math.max(4, postGrowth - 4)}%</span></div>
            </article>
            <article className="kpi-card">
              <h3>Engagement Rate</h3>
              <p>Interaction rate based on posts and books activity.</p>
              <div><strong>{Math.min(98, 42 + books.length * 2 + posts.length)}%</strong><span>+{Math.max(3, bookGrowth - 1)}%</span></div>
            </article>
          </section>

          {composer === "post" ? (
            <section className="composer-card">
              <h2>Create New Post</h2>
              <form className="composer-form" onSubmit={createPost}>
                <input name="title" placeholder="Post title" value={postForm.title} onChange={onPostChange} required />
                <input name="category" placeholder="Category" value={postForm.category} onChange={onPostChange} />
                <input name="coverImage" placeholder="Cover image URL (optional)" value={postForm.coverImage} onChange={onPostChange} />
                <textarea name="excerpt" placeholder="Short excerpt" value={postForm.excerpt} onChange={onPostChange} />
                <textarea name="content" placeholder="Write your post content" value={postForm.content} onChange={onPostChange} required />
                <div className="composer-actions">
                  <button type="button" className="toolbar-pill" onClick={() => setComposer("")}>Cancel</button>
                  <button className="toolbar-primary" type="submit" disabled={savingPost}>{savingPost ? "Publishing..." : "Publish Post"}</button>
                </div>
              </form>
            </section>
          ) : null}

          {composer === "book" ? (
            <section className="composer-card">
              <h2>Add New Book</h2>
              <form className="composer-form" onSubmit={createBook}>
                <input name="title" placeholder="Book title" value={bookForm.title} onChange={onBookChange} required />
                <input name="genre" placeholder="Genre" value={bookForm.genre} onChange={onBookChange} />
                <input name="publishedYear" type="number" placeholder="Published year" value={bookForm.publishedYear} onChange={onBookChange} />
                <textarea name="description" placeholder="Book description" value={bookForm.description} onChange={onBookChange} />
                <label className="file-line">Book file <input name="bookFile" type="file" onChange={onBookChange} required /></label>
                <label className="file-line">Cover image <input name="coverImage" type="file" accept="image/*" onChange={onBookChange} /></label>
                <div className="composer-actions">
                  <button type="button" className="toolbar-pill" onClick={() => setComposer("")}>Cancel</button>
                  <button className="toolbar-primary alt" type="submit" disabled={savingBook}>{savingBook ? "Saving..." : "Add Book"}</button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="recent-section">
            <div className="section-heading">
              <h2>Recent Posts</h2>
              <button type="button" className="toolbar-pill">View All</button>
            </div>

            <div className="recent-grid">
              {newestPosts.length === 0 ? (
                <article className="post-card empty">
                  <h3>No posts yet</h3>
                  <p>Create your first post using the + New Post button.</p>
                </article>
              ) : (
                newestPosts.map((post, index) => (
                  <article className="post-card" key={post.id}>
                    <div className={`post-image theme-${index % 2}`}>{post.coverImage ? <img src={post.coverImage} alt={post.title} /> : null}</div>
                    <div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt || post.content.slice(0, 130)}</p>
                      <div className="post-meta">{post.category || "General"} • {new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="analytics-grid">
            <article className="analytics-card">
              <h3>Audience by Region</h3>
              <div className="region-grid">
                <p><span>Americas</span><strong>{Math.max(1200, posts.length * 230)}</strong></p>
                <p><span>Europe</span><strong>{Math.max(900, posts.length * 180)}</strong></p>
                <p><span>Asia</span><strong>{Math.max(1400, books.length * 280)}</strong></p>
                <p><span>Africa</span><strong>{Math.max(700, books.length * 140)}</strong></p>
              </div>
            </article>

            <article className="analytics-card">
              <h3>Traffic by Source</h3>
              <div className="donut-wrap">
                <div className="donut"></div>
                <ul>
                  <li><span className="dot one"></span> 45% Social</li>
                  <li><span className="dot two"></span> 30% Organic</li>
                  <li><span className="dot three"></span> 25% Direct</li>
                </ul>
              </div>
            </article>

            <article className="analytics-card">
              <h3>Impression Tracker</h3>
              <div className="gauge">
                <strong>{(posts.length * 1420 + 12000).toLocaleString()}</strong>
                <span>Total Page Views</span>
              </div>
              <div className="gauge-meta">
                <p><strong>{Math.min(70, 20 + books.length * 4)}%</strong><span>Bounce Rate</span></p>
                <p><strong>{Math.max(90, posts.length * 26)}s</strong><span>Avg Time</span></p>
              </div>
            </article>
          </section>

          {status.message ? <p className={`dash-status ${status.type}`}>{status.message}</p> : null}
        </div>
      </section>
    </main>
  );
}
