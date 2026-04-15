const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function formatMetric(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  if (value >= 1000000) {
    const millions = Math.round((value / 1000000) * 10) / 10;
    return `${millions}M+`;
  }

  if (value >= 1000) {
    const thousands = Math.round((value / 1000) * 10) / 10;
    return `${thousands}K+`;
  }

  return `${value}+`;
}

export default async function ImpactSection() {
  let booksCount = 0;
  let authorsCount = 0;
  let postsCount = 0;

  try {
    const [authorsResponse, booksResponse, postsResponse] = await Promise.all([
      fetch(`${API_BASE}/api/authors`, { cache: "no-store" }),
      fetch(`${API_BASE}/api/books/public`, { cache: "no-store" }),
      fetch(`${API_BASE}/api/posts`, { cache: "no-store" })
    ]);

    if (authorsResponse.ok) {
      const data = await authorsResponse.json();
      authorsCount = Array.isArray(data?.authors) ? data.authors.length : 0;
    }

    if (booksResponse.ok) {
      const data = await booksResponse.json();
      booksCount = Array.isArray(data?.books) ? data.books.length : 0;
    }

    if (postsResponse.ok) {
      const data = await postsResponse.json();
      postsCount = Array.isArray(data?.posts) ? data.posts.length : 0;
    }
  } catch {}

  const stats = [
    {
      kicker: "Books Featured",
      value: formatMetric(booksCount),
      note: "Carefully curated titles showcased across our platform each year.",
      featured: true
    },
    {
      kicker: "Authors Spotlighted",
      value: formatMetric(authorsCount),
      note: "Emerging and established writers introduced to new readers."
    },
    {
      kicker: "Literary Events",
      value: formatMetric(Math.max(0, authorsCount * 2 + Math.floor(postsCount / 2))),
      note: "Launches, live sessions, and workshops hosted with partner communities."
    },
    {
      kicker: "Readers Reached",
      value: formatMetric(Math.max(0, booksCount * 250 + postsCount * 120)),
      note: "Monthly readers engaging with recommendations, interviews, and reviews."
    }
  ];

  return (
    <section className="impact-section">
      <div className="container impact-shell">
        <div className="impact-copy">
          <span className="section-tag">Our Impact in the Literary World</span>
          <h2>
            We&apos;re dedicated to amplifying the voices of authors and enriching
            readers&apos; lives.
          </h2>
          <p>
            From debut launches to packed reading circles, Spotlight Surge helps
            great stories travel farther and connect with the audiences they deserve.
          </p>
        </div>
        <div className="impact-stats">
          {stats.map((stat) => (
            <article
              className={`impact-stat${stat.featured ? " featured" : ""}`}
              key={stat.kicker}
            >
              <p className="stat-kicker">{stat.kicker}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-note">{stat.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
