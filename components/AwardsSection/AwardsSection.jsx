const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const fallbackBooks = [
  {
    title: "Spotlight Selection",
    copy: "Exceptional storytelling and lasting impact with unforgettable characters.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1100&q=80",
    alt: "Award-winning fiction book on a table"
  },
  {
    title: "Reader Favorite",
    copy: "Remarkable writing that stays with readers long after the final page.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1100&q=80",
    alt: "Stack of notable books with warm lighting"
  },
  {
    title: "Editor’s Pick",
    copy: "Critically acclaimed prose and emotional depth that define contemporary fiction.",
    image:
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1100&q=80",
    alt: "Open book with highlighted pages and notes"
  }
];

export default async function AwardsSection() {
  let awardBooks = fallbackBooks;

  try {
    const response = await fetch(`${API_BASE}/api/books/public`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      const books = Array.isArray(data?.books) ? data.books : [];
      const picks = books.slice(0, 3).map((book, index) => ({
        title: book.title || fallbackBooks[index]?.title || "Featured Book",
        copy: book.description || fallbackBooks[index]?.copy || "Discover a standout title from our author community.",
        image: book.coverImageUrl || fallbackBooks[index]?.image,
        alt: book.title || fallbackBooks[index]?.alt || "Featured book cover"
      }));

      if (picks.length === 3) {
        awardBooks = picks;
      }
    }
  } catch {}

  return (
    <section id="authors" className="awards-section">
      <div className="container section-shell awards-shell">
        <div className="section-title">
          <span className="section-tag">Award-Winning Books You Can&apos;t Miss</span>
          <h2>Explore standout titles selected for exceptional storytelling.</h2>
        </div>
        <div className="awards-grid">
          {awardBooks.map((book) => (
            <article className="award-card" key={book.title}>
              <img className="award-card-image" src={book.image} alt={book.alt} />
              <h3>{book.title}</h3>
              <p>{book.copy}</p>
              <a className="btn btn-secondary" href="#books">
                Discover More Books
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
