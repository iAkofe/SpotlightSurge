const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function pad(value) {
  return String(value).padStart(2, "0");
}

function getCountdownParts(target) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    { value: pad(days), unit: "Days" },
    { value: pad(hours), unit: "Hours" },
    { value: pad(minutes), unit: "Minutes" },
    { value: pad(seconds), unit: "Seconds" }
  ];
}

export default async function LaunchSection() {
  let authorName = "Spotlight Author";
  let bookTitle = "next bestseller";

  try {
    const [authorsResponse, booksResponse] = await Promise.all([
      fetch(`${API_BASE}/api/authors`, { cache: "no-store" }),
      fetch(`${API_BASE}/api/books/public`, { cache: "no-store" })
    ]);

    if (authorsResponse.ok) {
      const data = await authorsResponse.json();
      const authors = Array.isArray(data?.authors) ? data.authors : [];
      if (authors[0]?.name) {
        authorName = authors[0].name;
      }
    }

    if (booksResponse.ok) {
      const data = await booksResponse.json();
      const books = Array.isArray(data?.books) ? data.books : [];
      if (books[0]?.title) {
        bookTitle = books[0].title;
      }
    }
  } catch {}

  const target = new Date();
  target.setDate(target.getDate() + 12);
  target.setHours(19, 0, 0, 0);
  const countdown = getCountdownParts(target);

  return (
    <section className="launch-section">
      <div className="container section-shell launch-shell">
        <div className="launch-copy">
          <span className="section-tag">The Countdown Begins</span>
          <h2>
            Get ready for {authorName}&apos;s next launch: “{bookTitle}”.
          </h2>
          <p>
            We&apos;re counting down to release day with behind-the-scenes updates,
            early excerpts, and exclusive event access.
          </p>
          <div className="countdown-grid">
            {countdown.map((item) => (
              <div className="countdown-cell" key={item.unit}>
                <strong>{item.value}</strong>
                <span>{item.unit}</span>
              </div>
            ))}
          </div>
          <div className="launch-meta">
            <span>Live Stream</span>
            <span>Author Q&amp;A</span>
            <span>Giveaways</span>
          </div>
          <a className="btn btn-primary" href="#events">
            Join the Launch Event
          </a>
        </div>
        <aside className="launch-media">
          <img
            src="https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=1200&q=80"
            alt="Vinyl and headphones"
          />
        </aside>
      </div>
    </section>
  );
}
