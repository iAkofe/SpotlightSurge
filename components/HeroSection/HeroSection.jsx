const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const fallbackImages = [
  {
    src: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=700&q=80",
    alt: "Books and coffee"
  },
  {
    src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80",
    alt: "Writing desk"
  },
  {
    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80",
    alt: "Readers enjoying a book club"
  },
  {
    src: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=700&q=80",
    alt: "Open journal and pencil"
  },
  {
    src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
    alt: "Book cover details"
  }
];

export default async function HeroSection() {
  let heroImages = fallbackImages;

  try {
    const response = await fetch(`${API_BASE}/api/books/public`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      const books = Array.isArray(data?.books) ? data.books : [];
      const covers = books
        .filter((book) => book?.coverImageUrl)
        .slice(0, 5)
        .map((book) => ({
          src: book.coverImageUrl,
          alt: book.title || "Featured book"
        }));

      if (covers.length >= 3) {
        heroImages = covers.length >= 5 ? covers : [...covers, ...fallbackImages].slice(0, 5);
      }
    }
  } catch {}

  return (
    <section className="hero">
      <div className="container hero-shell">
        <span className="hero-spark left">✷</span>
        <span className="hero-spark right">✦</span>
        <div className="hero-text">
          <span className="section-tag">Literary Platform</span>
          <h1 className="hero-title">
            Where Stories <span className="hero-highlight">Come</span> Alive
          </h1>
          <p>
            Discover, celebrate, and promote the authors and books that move you. A
            platform where literary journeys unfold and creative voices rise.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#books">
              Explore Books
            </a>
            <a className="btn btn-secondary" href="#authors">
              For Authors
            </a>
          </div>
        </div>
        <div className="hero-gallery">
          {heroImages.map((image) => (
            <div className="hero-card" key={image.src}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
