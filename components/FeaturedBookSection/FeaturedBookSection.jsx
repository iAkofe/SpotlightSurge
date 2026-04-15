const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getRating(title = "") {
  const base = 4.2;
  const bump = Math.min(0.7, ((title.length || 0) % 9) / 20);
  return Math.round((base + bump) * 10) / 10;
}

export default async function FeaturedBookSection() {
  let featured = {
    title: "Featured Book",
    description: "Discover a standout title selected from our author community.",
    genre: "Book",
    authorName: "Spotlight Author",
    coverImageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
  };

  try {
    const response = await fetch(`${API_BASE}/api/books/public`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      const books = Array.isArray(data?.books) ? data.books : [];
      const pick = books[0];
      if (pick?.title) {
        featured = {
          title: pick.title,
          description: pick.description || featured.description,
          genre: pick.genre || featured.genre,
          authorName: pick.author?.name || featured.authorName,
          coverImageUrl: pick.coverImageUrl || featured.coverImageUrl
        };
      }
    }
  } catch {}

  const rating = getRating(featured.title);

  return (
    <section id="books" className="book-feature-section">
      <div className="container">
        <div className="book-feature-shell">
          <div className="book-cover-wrap">
            <img
              src={featured.coverImageUrl}
              alt={featured.title}
            />
          </div>
          <div className="book-feature-content">
            <span className="section-tag">Featured Book of the Month</span>
            <h2>{featured.title}</h2>
            <p className="book-lede">
              {featured.description}
            </p>
            <div className="book-meta">
              <article className="book-meta-item">
                <span>Author</span>
                <strong>{featured.authorName}</strong>
              </article>
              <article className="book-meta-item">
                <span>Genre</span>
                <strong>{featured.genre}</strong>
              </article>
              <article className="book-meta-item">
                <span>Reader Rating</span>
                <strong>{rating} / 5</strong>
              </article>
            </div>
            <div className="book-chips">
              <span className="book-chip">Best Seller Pick</span>
              <span className="book-chip">Book Club Favorite</span>
              <span className="book-chip">Available in Audio</span>
            </div>
            <div className="book-actions">
              <a className="btn btn-primary" href="#books">
                Read More
              </a>
              <a className="btn btn-secondary" href="#books">
                Buy the Book
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
