const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getNextDateString(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export default async function AuthorSpotlightSection() {
  let authorName = "Spotlight Author";
  let latestBookTitle = "their latest book";
  let authorId = "";

  try {
    const authorsResponse = await fetch(`${API_BASE}/api/authors`, { cache: "no-store" });
    if (authorsResponse.ok) {
      const data = await authorsResponse.json();
      const authors = Array.isArray(data?.authors) ? data.authors : [];
      const pick = authors[0];
      if (pick?.name) {
        authorName = pick.name;
        authorId = pick.id || "";
      }
    }

    if (authorId) {
      const profileResponse = await fetch(`${API_BASE}/api/authors/${authorId}`, { cache: "no-store" });
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        const latestBook = Array.isArray(profile?.books) ? profile.books[0] : null;
        if (latestBook?.title) {
          latestBookTitle = latestBook.title;
        }
      }
    }
  } catch {}

  const eventDate = getNextDateString(9);
  const eventTime = "7:00 PM";
  const hostName = "Spotlight Surge Team";

  const eventCards = [
    {
      title: "Date",
      detail: `Date: ${eventDate}`,
      copy: `Join us for an intimate conversation with ${authorName} as we explore “${latestBookTitle}” and the stories that inspire their writing.`,
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
      alt: "Writing desk and notes"
    },
    {
      title: "Time",
      detail: `Time: ${eventTime}`,
      copy: `Join us for an intimate conversation with ${authorName} as we explore “${latestBookTitle}” and the stories that inspire their writing.`,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
      alt: "Open books and notes",
      featured: true
    },
    {
      title: "Host",
      detail: `Host: ${hostName}`,
      cta: true,
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
      alt: "Bookshelf and reading space"
    }
  ];

  return (
    <section id="events" className="classes-section">
      <div className="container">
        <div className="classes-top">
          <h2>Author Spotlight Event</h2>
          <p>
            Join us for an intimate conversation with {authorName} as we explore
            “{latestBookTitle}” and the stories that inspire their writing.
          </p>
        </div>

        <div className="classes-grid">
          {eventCards.map((card) => (
            <article
              className={`class-card${card.featured ? " featured" : ""}`}
              key={card.title}
            >
              <div className="card-top">
                <h4>{card.title}</h4>
              </div>
              <hr />
              <p>{card.detail}</p>
              {card.cta ? (
                <a className="btn btn-primary" href="#events">
                  Register Now
                </a>
              ) : (
                <p>{card.copy}</p>
              )}
              <div className="card-media">
                <img src={card.image} alt={card.alt} />
              </div>
            </article>
          ))}
        </div>

        <div className="classes-quote">
          <span className="classes-star left">✷</span>
          <h3>
            SUPPORTING <span className="outline">AUTHORS</span>.
            <br />
            ENRICHING <span className="accent">READERS.</span>
          </h3>
          <p>
            Spotlight Surge
            <br />
            <strong>
              Empowering authors, celebrating stories, and building a community of
              passionate readers.
            </strong>
          </p>
          <span className="classes-star right">✷</span>
        </div>
      </div>
    </section>
  );
}
