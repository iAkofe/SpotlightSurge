const eventCards = [
  {
    title: "Date",
    detail: "Date: [Event Date]",
    copy: "Join us for an intimate conversation with [Author Name] as we explore their latest book and the stories that inspire their writing.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    alt: "Writing desk and notes"
  },
  {
    title: "Time",
    detail: "Time: [Event Time]",
    copy: "Join us for an intimate conversation with [Author Name] as we explore their latest book and the stories that inspire their writing.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    alt: "Open books and notes",
    featured: true
  },
  {
    title: "Host",
    detail: "Host: [Host Name]",
    cta: true,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
    alt: "Bookshelf and reading space"
  }
];

export default function AuthorSpotlightSection() {
  return (
    <section id="events" className="classes-section">
      <div className="container">
        <div className="classes-top">
          <h2>Author Spotlight Event</h2>
          <p>
            Join us for an intimate conversation with [Author Name] as we explore
            their latest book and the stories that inspire their writing.
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
