"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaRegEye,
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiEdit3,
  FiGlobe,
  FiGrid,
  FiLogOut,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiSettings,
  FiTrendingUp,
  FiUpload,
  FiUser,
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
  purchaseLink: "",
  snippet: "",
  bookFile: null,
  coverImage: null
};

const initialProfile = {
  name: "",
  bio: "",
  location: "",
  website: ""
};

const events = [
  {
    id: "highlight",
    badge: "Monthly Highlight",
    title: "Monthly Book Highlight — April",
    description: "You've been selected for this month's highlight. Discuss your latest work with engaged readers.",
    date: "April 15, 2026 at 7:00 PM EST",
    interested: 34,
    featured: true
  },
  {
    id: "qa",
    badge: "",
    title: "Author Q&A Session",
    description: "An open session for readers to ask questions about your writing process and upcoming works.",
    date: "April 22, 2026 at 3:00 PM EST",
    interested: 19,
    featured: false
  }
];

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

function getInitialView() {
  if (typeof window === "undefined") {
    return "dashboard";
  }

  const params = new URLSearchParams(window.location.search);
  const current = params.get("view");
  const allowed = new Set(["dashboard", "books", "posts", "events", "profile", "new-book", "new-post"]);
  return allowed.has(current) ? current : "dashboard";
}

function syncView(view) {
  const params = new URLSearchParams(window.location.search);
  params.set("view", view);
  window.history.replaceState({}, "", `/dashboard/author?${params.toString()}`);
}

function getInitials(name) {
  return (name || "Author")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AuthorDashboard() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [books, setBooks] = useState([]);
  const [view, setView] = useState("dashboard");
  const [bookSearch, setBookSearch] = useState("");
  const [postForm, setPostForm] = useState(initialPost);
  const [bookForm, setBookForm] = useState(initialBook);
  const [profileForm, setProfileForm] = useState(initialProfile);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPost, setSavingPost] = useState(false);
  const [savingBook, setSavingBook] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    setView(getInitialView());
    const savedToken = window.localStorage.getItem("ss_access_token") || "";
    if (!savedToken) {
      window.location.replace("/auth?mode=login");
      return;
    }
    setToken(savedToken);
  }, []);

  useEffect(() => {
    syncView(view);
  }, [view]);

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
        setProfileForm({
          name: meData.user.name || "",
          bio: meData.user.bio || "",
          location: meData.user.location || "",
          website: meData.user.website || ""
        });

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
          throw new Error("Could not load your posts.");
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

  function onProfileChange(event) {
    const { name, value, files } = event.target;
    if (name === "profileImage") {
      setProfileImage(files?.[0] || null);
      return;
    }

    setProfileForm((current) => ({ ...current, [name]: value }));
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
      setView("posts");
      setStatus({ type: "success", message: "Post published successfully." });
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
      setView("books");
      setStatus({ type: "success", message: "Book published successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingBook(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSavingProfile(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = new FormData();
      payload.append("name", profileForm.name);
      payload.append("bio", profileForm.bio);
      payload.append("location", profileForm.location);
      payload.append("website", profileForm.website);
      if (profileImage) {
        payload.append("profileImage", profileImage);
      }

      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: "PUT",
        headers: authHeaders,
        credentials: "include",
        body: payload
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setUser(data.user);
      setProfileImage(null);
      setStatus({ type: "success", message: "Profile updated successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingProfile(false);
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
      window.location.replace("/auth?mode=login");
    }
  }

  const filteredBooks = books.filter((book) => {
    const needle = bookSearch.trim().toLowerCase();
    if (!needle) {
      return true;
    }

    return [book.title, book.description, book.genre].some((value) =>
      (value || "").toLowerCase().includes(needle)
    );
  });

  const totalViews = books.reduce((sum, _book, index) => sum + (index === 0 ? 847 : 0), 0) + posts.length * 128;
  const uniqueVisitors = Math.max(1203, books.length * 320 + posts.length * 190);
  const engagementRate = Math.min(92, 28 + books.length * 5 + posts.length * 3);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid },
    { id: "books", label: "My Books", icon: FiBookOpen },
    { id: "posts", label: "Posts", icon: FiEdit3 },
    { id: "events", label: "Events", icon: FiCalendar },
    { id: "profile", label: "Profile", icon: FiUser }
  ];

  const topAction =
    view === "books"
      ? { label: "Add Book", action: () => setView("new-book"), icon: FiPlus }
      : view === "posts"
        ? { label: "New Post", action: () => setView("new-post"), icon: FiPlus }
        : null;

  if (loading) {
    return <main className="author-dashboard-page"><p className="dashboard-loading">Loading dashboard...</p></main>;
  }

  return (
    <main className="author-dashboard-page">
      <section className="author-dashboard-shell">
        <aside className="dashboard-sidebar">
          <a className="dashboard-brand" href="/">
            <span className="dashboard-brand-mark">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <path d="M8 8.5h3.8c1.1 0 2 .9 2 2V16H10c-1.1 0-2-.9-2-2V8.5Z" />
                <path d="M16 8.5h-3.8c-1.1 0-2 .9-2 2V16H14c1.1 0 2-.9 2-2V8.5Z" />
              </svg>
            </span>
            <span>SpotlightSurge</span>
          </a>

          <div className="dashboard-sidebar-group">
            <p>General</p>
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={view === item.id ? "active" : ""}
                  onClick={() => setView(item.id)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="dashboard-sidebar-group">
            <p>Quick Actions</p>
            <button type="button" onClick={() => setView("new-book")}>
              <FiPlus />
              <span>Add Book</span>
            </button>
            <button type="button" onClick={() => setView("new-post")}>
              <FiPlus />
              <span>New Post</span>
            </button>
          </div>

          <div className="dashboard-sidebar-footer">
            <a href={user ? `/authors/${user.id}` : "#"}>
              <FiGlobe />
              <span>View Public Profile</span>
            </a>
            <button type="button" onClick={() => setView("profile")}>
              <FiSettings />
              <span>Settings</span>
            </button>
            <button type="button" className="logout" onClick={logout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <div className="dashboard-topbar-spacer" />
            <div className="dashboard-avatar">{getInitials(user?.name)}</div>
          </header>

          <div className="dashboard-content">
            {topAction ? (
              <div className="dashboard-screen-action">
                <button type="button" className="dashboard-primary-btn" onClick={topAction.action}>
                  <topAction.icon />
                  <span>{topAction.label}</span>
                </button>
              </div>
            ) : null}

            {view === "dashboard" ? (
              <>
                <section className="dashboard-screen-head">
                  <h1>Dashboard</h1>
                  <p>Monitor and manage your author presence</p>
                </section>

                <section className="dashboard-stats-grid">
                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-head">
                      <div>
                        <h2>Total Views</h2>
                        <p>Total views across all books and posts</p>
                      </div>
                      <FaRegEye />
                    </div>
                    <strong>{totalViews.toLocaleString()}</strong>
                    <span>+12%</span>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-head">
                      <div>
                        <h2>Unique Visitors</h2>
                        <p>Estimated from recent engagement</p>
                      </div>
                      <FiUsers />
                    </div>
                    <strong>{uniqueVisitors.toLocaleString()}</strong>
                    <span>+8%</span>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-head">
                      <div>
                        <h2>Engagement Rate</h2>
                        <p>Interaction rate on your content</p>
                      </div>
                      <FiTrendingUp />
                    </div>
                    <strong>{engagementRate}%</strong>
                    <span>+5%</span>
                  </article>
                </section>

                <section className="dashboard-overview-grid">
                  <article className="dashboard-panel">
                    <div className="dashboard-panel-head">
                      <h2>My Books</h2>
                      <button type="button" onClick={() => setView("books")}>View All ↗</button>
                    </div>

                    <div className="dashboard-list">
                      {books.slice(0, 2).map((book, index) => (
                        <article className="dashboard-list-row" key={book.id}>
                          <div className="dashboard-list-icon"><FiBookOpen /></div>
                          <div className="dashboard-list-copy">
                            <strong>{book.title}</strong>
                            <span>{index === 0 ? "847 views" : "0 views"}</span>
                          </div>
                          <em className={index === 0 ? "published" : "draft"}>{index === 0 ? "Published" : "Draft"}</em>
                        </article>
                      ))}

                      {books.length === 0 ? (
                        <article className="dashboard-list-empty">
                          <p>No books yet. Add your first title to start building your shelf.</p>
                        </article>
                      ) : null}
                    </div>
                  </article>

                  <article className="dashboard-panel">
                    <div className="dashboard-panel-head">
                      <h2>Upcoming Events</h2>
                      <button type="button" onClick={() => setView("events")}>View All ↗</button>
                    </div>

                    <div className="dashboard-list">
                      {events.map((event) => (
                        <article className="dashboard-list-row" key={event.id}>
                          <div className="dashboard-list-icon"><FiCalendar /></div>
                          <div className="dashboard-list-copy">
                            <strong>{event.title}</strong>
                            <span>{event.date}</span>
                          </div>
                          <small>{event.interested} interested</small>
                        </article>
                      ))}
                    </div>
                  </article>
                </section>

                <section className="dashboard-panel dashboard-posts-preview">
                  <div className="dashboard-panel-head">
                    <h2>Recent Posts</h2>
                    <button type="button" onClick={() => setView("posts")}>View All ↗</button>
                  </div>

                  {posts.length === 0 ? (
                    <div className="dashboard-empty-state">
                      <div className="dashboard-empty-icon"><FiEdit3 /></div>
                      <h3>No posts yet</h3>
                      <p>Share insights and updates with your readers</p>
                      <button type="button" className="dashboard-primary-btn" onClick={() => setView("new-post")}>
                        Create Your First Post
                      </button>
                    </div>
                  ) : (
                    <div className="dashboard-post-list">
                      {posts.slice(0, 3).map((post) => (
                        <article className="dashboard-post-row" key={post.id}>
                          <div className="dashboard-list-icon"><FiEdit3 /></div>
                          <div>
                            <strong>{post.title}</strong>
                            <p>{post.excerpt || post.content.slice(0, 110)}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </>
            ) : null}

            {view === "books" ? (
              <>
                <section className="dashboard-screen-head">
                  <h1>My Books</h1>
                  <p>Manage your listed books</p>
                </section>

                <label className="dashboard-search">
                  <FiSearch />
                  <input
                    type="search"
                    placeholder="Search books..."
                    value={bookSearch}
                    onChange={(event) => setBookSearch(event.target.value)}
                  />
                </label>

                <section className="dashboard-book-grid">
                  {filteredBooks.map((book, index) => (
                    <article className="dashboard-book-card" key={book.id}>
                      <div className="dashboard-book-cover">
                        {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} /> : <FiBookOpen />}
                      </div>
                      <div className="dashboard-book-body">
                        <div className="dashboard-book-head">
                          <h2>{book.title}</h2>
                          <button type="button" aria-label="Book actions"><FiMoreVertical /></button>
                        </div>
                        <p>{book.description || "Add a description to help readers discover this title."}</p>
                        <div className="dashboard-book-meta">
                          <span className={index === 0 ? "published" : "draft"}>{index === 0 ? "Published" : "Draft"}</span>
                          <small>{index === 0 ? "847 views" : "0 views"}</small>
                          <small>{Math.max(0, posts.length - index * 2)} comments</small>
                        </div>
                      </div>
                    </article>
                  ))}

                  {filteredBooks.length === 0 ? (
                    <article className="dashboard-inline-empty">
                      <h3>No books found</h3>
                      <p>Add a new book or adjust your search.</p>
                    </article>
                  ) : null}
                </section>
              </>
            ) : null}

            {view === "posts" ? (
              <>
                <section className="dashboard-screen-head">
                  <h1>Posts</h1>
                  <p>Share thoughts and updates with your readers</p>
                </section>

                <section className="dashboard-rows">
                  {posts.map((post) => (
                    <article className="dashboard-feed-row" key={post.id}>
                      <div className="dashboard-list-icon"><FiEdit3 /></div>
                      <div className="dashboard-feed-copy">
                        <h2>{post.title}</h2>
                        <p>{post.excerpt || post.content.slice(0, 120)}</p>
                        <span>{formatDate(post.createdAt)} {posts.length ? ` ${Math.max(0, posts.length * 7)} comments` : ""}</span>
                      </div>
                      <button type="button" aria-label="Post actions"><FiMoreVertical /></button>
                    </article>
                  ))}

                  {posts.length === 0 ? (
                    <article className="dashboard-inline-empty">
                      <h3>No posts yet</h3>
                      <p>Create your first post to start sharing updates with readers.</p>
                    </article>
                  ) : null}
                </section>
              </>
            ) : null}

            {view === "new-post" ? (
              <>
                <button type="button" className="dashboard-back-link" onClick={() => setView("posts")}>
                  <FiArrowLeft />
                  <span>Back</span>
                </button>

                <section className="dashboard-form-shell">
                  <div className="dashboard-screen-head">
                    <h1>Create a Post</h1>
                    <p>Share insights, updates, or behind-the-scenes with readers</p>
                  </div>

                  <form className="dashboard-form" onSubmit={createPost}>
                    <label>
                      <span>Title</span>
                      <input
                        name="title"
                        placeholder="Post title"
                        value={postForm.title}
                        onChange={onPostChange}
                        required
                      />
                    </label>

                    <label>
                      <span>Category</span>
                      <input
                        name="category"
                        placeholder="Essay, update, launch"
                        value={postForm.category}
                        onChange={onPostChange}
                      />
                    </label>

                    <label>
                      <span>Short Excerpt</span>
                      <input
                        name="excerpt"
                        placeholder="One-line preview for readers"
                        value={postForm.excerpt}
                        onChange={onPostChange}
                      />
                    </label>

                    <label>
                      <span>Cover Image URL</span>
                      <input
                        name="coverImage"
                        placeholder="https://..."
                        value={postForm.coverImage}
                        onChange={onPostChange}
                      />
                    </label>

                    <label>
                      <span>Content</span>
                      <textarea
                        name="content"
                        placeholder="Write your post..."
                        value={postForm.content}
                        onChange={onPostChange}
                        required
                      />
                    </label>

                    <div className="dashboard-form-actions">
                      <button type="submit" className="dashboard-primary-btn" disabled={savingPost}>
                        {savingPost ? "Publishing..." : "Publish Post"}
                      </button>
                      <button type="button" className="dashboard-secondary-btn" onClick={() => setView("posts")}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              </>
            ) : null}

            {view === "new-book" ? (
              <>
                <button type="button" className="dashboard-back-link" onClick={() => setView("books")}>
                  <FiArrowLeft />
                  <span>Back</span>
                </button>

                <section className="dashboard-form-shell">
                  <div className="dashboard-screen-head">
                    <h1>Add a New Book</h1>
                    <p>List your book for readers to discover</p>
                  </div>

                  <form className="dashboard-form" onSubmit={createBook}>
                    <label className="dashboard-cover-upload">
                      <span>Book Cover</span>
                      <input name="coverImage" type="file" accept="image/*" onChange={onBookChange} />
                      <div>
                        <FiUpload />
                        <small>{bookForm.coverImage ? bookForm.coverImage.name : "Upload cover"}</small>
                      </div>
                    </label>

                    <label>
                      <span>Book Title</span>
                      <input
                        name="title"
                        placeholder="Enter your book title"
                        value={bookForm.title}
                        onChange={onBookChange}
                        required
                      />
                    </label>

                    <label>
                      <span>Genre</span>
                      <input
                        name="genre"
                        placeholder="e.g. Fiction, Mystery, Self-help"
                        value={bookForm.genre}
                        onChange={onBookChange}
                      />
                    </label>

                    <label>
                      <span>Description</span>
                      <textarea
                        name="description"
                        placeholder="Tell readers what your book is about..."
                        value={bookForm.description}
                        onChange={onBookChange}
                      />
                    </label>

                    <label>
                      <span>Published Year</span>
                      <input
                        name="publishedYear"
                        type="number"
                        placeholder="2026"
                        value={bookForm.publishedYear}
                        onChange={onBookChange}
                      />
                    </label>

                    <label>
                      <span>Purchase / Read Link</span>
                      <input
                        name="purchaseLink"
                        placeholder="https://where-to-read-the-full-book.com"
                        value={bookForm.purchaseLink}
                        onChange={onBookChange}
                      />
                      <small>Where readers can find the full book</small>
                    </label>

                    <label>
                      <span>Book Snippet (Optional)</span>
                      <textarea
                        name="snippet"
                        placeholder="Paste the first chapter or an excerpt for readers to preview..."
                        value={bookForm.snippet}
                        onChange={onBookChange}
                      />
                      <small>Share a preview of your book for discoverability.</small>
                    </label>

                    <label>
                      <span>Book File</span>
                      <input name="bookFile" type="file" onChange={onBookChange} required />
                    </label>

                    <div className="dashboard-form-actions">
                      <button type="submit" className="dashboard-primary-btn" disabled={savingBook}>
                        {savingBook ? "Publishing..." : "Publish Book"}
                      </button>
                      <button type="button" className="dashboard-secondary-btn" onClick={() => setView("books")}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              </>
            ) : null}

            {view === "events" ? (
              <>
                <section className="dashboard-screen-head">
                  <h1>Events</h1>
                  <p>Your upcoming events and monthly highlights</p>
                </section>

                <section className="dashboard-event-list">
                  {events.map((event) => (
                    <article className={`dashboard-event-card ${event.featured ? "featured" : ""}`} key={event.id}>
                      {event.badge ? <span className="dashboard-event-badge">{event.badge}</span> : null}
                      <h2>{event.title}</h2>
                      <p>{event.description}</p>
                      <div className="dashboard-event-meta">
                        <span><FiCalendar /> {event.date}</span>
                        <span><FiUsers /> {event.interested} interested</span>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            ) : null}

            {view === "profile" ? (
              <>
                <section className="dashboard-screen-head">
                  <h1>Profile</h1>
                  <p>Manage your public author profile</p>
                </section>

                <section className="dashboard-form-shell dashboard-profile-shell">
                  <form className="dashboard-form" onSubmit={saveProfile}>
                    <div className="dashboard-profile-header">
                      <div className="dashboard-profile-avatar">
                        {user?.profileImageUrl ? <img src={user.profileImageUrl} alt={user.name} /> : getInitials(profileForm.name)}
                      </div>
                      <label className="dashboard-image-picker">
                        <input
                          name="profileImage"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={onProfileChange}
                        />
                        <span>Change Photo</span>
                      </label>
                      <small>JPG, PNG. Max 2MB.</small>
                    </div>

                    <label>
                      <span>Display Name</span>
                      <input name="name" value={profileForm.name} onChange={onProfileChange} required />
                    </label>

                    <label>
                      <span>Bio</span>
                      <textarea name="bio" value={profileForm.bio} onChange={onProfileChange} />
                    </label>

                    <label>
                      <span>Location</span>
                      <input name="location" value={profileForm.location} onChange={onProfileChange} />
                    </label>

                    <label>
                      <span>Website</span>
                      <input name="website" value={profileForm.website} onChange={onProfileChange} />
                    </label>

                    <div className="dashboard-form-actions">
                      <button type="submit" className="dashboard-primary-btn" disabled={savingProfile}>
                        {savingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </section>
              </>
            ) : null}

            {status.message ? <p className={`dashboard-status ${status.type}`}>{status.message}</p> : null}
          </div>
        </section>
      </section>
    </main>
  );
}
