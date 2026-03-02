export default function FeaturedBookSection() {
  return (
    <section id="books" className="book-feature-section">
      <div className="container">
        <div className="book-feature-shell">
          <div className="book-cover-wrap">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
              alt="Featured book"
            />
          </div>
          <div className="book-feature-content">
            <span className="section-tag">Featured Book of the Month</span>
            <h2>The Midnight Library</h2>
            <p className="book-lede">
              Dive into the world of &ldquo;The Midnight Library&rdquo; by Matt Haig,
              a moving exploration of regret, possibility, and what makes a life
              meaningful.
            </p>
            <div className="book-meta">
              <article className="book-meta-item">
                <span>Author</span>
                <strong>Matt Haig</strong>
              </article>
              <article className="book-meta-item">
                <span>Genre</span>
                <strong>Contemporary Fiction</strong>
              </article>
              <article className="book-meta-item">
                <span>Reader Rating</span>
                <strong>4.8 / 5</strong>
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
