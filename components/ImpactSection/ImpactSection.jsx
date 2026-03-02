const stats = [
  {
    kicker: "Books Featured",
    value: "15K+",
    note: "Carefully curated titles showcased across our platform each year.",
    featured: true
  },
  {
    kicker: "Authors Spotlighted",
    value: "2.5K+",
    note: "Emerging and established writers introduced to new readers."
  },
  {
    kicker: "Literary Events",
    value: "1.5K+",
    note: "Launches, live sessions, and workshops hosted with partner communities."
  },
  {
    kicker: "Readers Reached",
    value: "300K+",
    note: "Monthly readers engaging with recommendations, interviews, and reviews."
  }
];

export default function ImpactSection() {
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
