"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Globe, MapPin, Search, User, ArrowRight } from "lucide-react";
import "./Archive.css";

function normalize(value) {
  return (value || "").toString().trim().toLowerCase();
}

function pickExcerpt(value, max = 140) {
  const text = (value || "").toString().trim();
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

function getInitials(name) {
  return (name || "Author")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Archive({ initialAuthors, initialBooks }) {
  const [mode, setMode] = useState("books");
  const [query, setQuery] = useState("");

  const authors = Array.isArray(initialAuthors) ? initialAuthors : [];
  const books = Array.isArray(initialBooks) ? initialBooks : [];

  const filteredAuthors = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return authors;
    return authors.filter((author) => {
      const haystack = [
        author?.name,
        author?.bio,
        author?.location,
        author?.website
      ]
        .map(normalize)
        .join(" ");
      return haystack.includes(needle);
    });
  }, [authors, query]);

  const filteredBooks = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return books;
    return books.filter((book) => {
      const haystack = [
        book?.title,
        book?.description,
        book?.genre,
        book?.author?.name
      ]
        .map(normalize)
        .join(" ");
      return haystack.includes(needle);
    });
  }, [books, query]);

  const counts = useMemo(
    () => ({
      authors: filteredAuthors.length,
      books: filteredBooks.length
    }),
    [filteredAuthors.length, filteredBooks.length]
  );

  const activeCount = mode === "authors" ? counts.authors : counts.books;

  return (
    <div className="archive-page">
      <section className="archive-hero">
        <div className="archive-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="archive-hero-tag">The Library</span>
            <h1 className="archive-hero-title">Browse Authors & Books</h1>
            <p className="archive-hero-subtitle">
              Discover voices, stories, and the people behind the pages.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="archive-main">
        <div className="archive-container">
          <header className="archive-controls">
            <div className="archive-tabs" role="tablist">
              <button
                type="button"
                className={`archive-tab ${mode === "books" ? "active" : ""}`}
                onClick={() => setMode("books")}
                role="tab"
                aria-selected={mode === "books"}
              >
                <BookOpen size={18} strokeWidth={2.5} />
                <span>Books</span>
                <span className="archive-tab-count">{counts.books}</span>
                {mode === "books" && (
                  <motion.div layoutId="activeTab" className="archive-tab-indicator" />
                )}
              </button>
              <button
                type="button"
                className={`archive-tab ${mode === "authors" ? "active" : ""}`}
                onClick={() => setMode("authors")}
                role="tab"
                aria-selected={mode === "authors"}
              >
                <User size={18} strokeWidth={2.5} />
                <span>Authors</span>
                <span className="archive-tab-count">{counts.authors}</span>
                {mode === "authors" && (
                  <motion.div layoutId="activeTab" className="archive-tab-indicator" />
                )}
              </button>
            </div>

            <div className="archive-search">
              <Search size={20} strokeWidth={2} className="archive-search-icon" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder={`Search ${mode}...`}
                aria-label={`Search ${mode}`}
              />
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="archive-grid"
            >
              {mode === "books" ? (
                filteredBooks.map((book, i) => (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="archive-item"
                    key={book.id}
                  >
                    <a className="archive-item-media" href={`/authors/${book.author?.id || book.authorId}`}>
                      {book.coverImageUrl ? (
                        <img src={book.coverImageUrl} alt={book.title} />
                      ) : (
                        <div className="archive-media-placeholder">
                          <BookOpen size={32} strokeWidth={1.5} />
                        </div>
                      )}
                    </a>
                    <div className="archive-item-content">
                      <div className="archive-item-meta">
                        <span className="archive-tag">{book.genre || "Book"}</span>
                      </div>
                      <h2 className="archive-item-title">{book.title}</h2>
                      <a className="archive-item-author" href={`/authors/${book.author?.id || book.authorId}`}>
                        By {book.author?.name || "Author"}
                      </a>
                      <p className="archive-item-desc">
                        {pickExcerpt(book.description, 120) || "No description provided yet."}
                      </p>
                      <div className="archive-item-footer">
                        <a className="archive-action-link" href={book.bookFileUrl} target="_blank" rel="noreferrer">
                          Read Now <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                filteredAuthors.map((author, i) => (
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="archive-item author-item"
                    key={author.id}
                  >
                    <a className="archive-item-media rounded" href={`/authors/${author.id}`}>
                      {author.profileImageUrl ? (
                        <img src={author.profileImageUrl} alt={author.name} />
                      ) : (
                        <div className="archive-media-placeholder">
                          {getInitials(author.name)}
                        </div>
                      )}
                    </a>
                    <div className="archive-item-content">
                      <h2 className="archive-item-title">{author.name}</h2>
                      <div className="archive-item-meta">
                        {author.location && (
                          <span className="meta-info">
                            <MapPin size={14} /> {author.location}
                          </span>
                        )}
                        {author.website && (
                          <a className="meta-info link" href={author.website} target="_blank" rel="noreferrer">
                            <Globe size={14} /> Website
                          </a>
                        )}
                      </div>
                      <p className="archive-item-desc">
                        {pickExcerpt(author.bio, 120) || "Author profile coming soon."}
                      </p>
                      <div className="archive-item-footer">
                        <a className="archive-action-link" href={`/authors/${author.id}`}>
                          View Profile <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {(mode === "books" && filteredBooks.length === 0) ||
          (mode === "authors" && filteredAuthors.length === 0) ? (
            <div className="archive-empty">
              <h3>No {mode} found</h3>
              <p>Try adjusting your search query.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

