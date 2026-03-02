const points = [
  "Early invitations to author launches and live Q&A sessions.",
  "Monthly reading list with editor notes and hidden gems.",
  "Subscriber-only giveaways, previews, and bonus chapters."
];

export default function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="container section-shell newsletter-shell">
        <div className="newsletter-copy">
          <span className="section-tag">Silent Book Club Delivered</span>
          <h2>Get monthly spotlights, private invites, and author gifts.</h2>
          <p>
            One curated email each month with upcoming events, new releases, and
            editorial picks from the Spotlight team.
          </p>
          <ul className="newsletter-points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="newsletter-card">
          <p className="newsletter-kicker">Monthly editorial brief</p>
          <h3>Join 12,000+ readers building a better TBR.</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="Email address" />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
          </form>
          <div className="newsletter-benefits">
            <span>1 email / month</span>
            <span>No spam ever</span>
            <span>Unsubscribe anytime</span>
          </div>
          <p className="newsletter-disclaimer">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
