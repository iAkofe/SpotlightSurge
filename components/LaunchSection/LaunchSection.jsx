const countdown = [
  { value: "12", unit: "Days" },
  { value: "08", unit: "Hours" },
  { value: "42", unit: "Minutes" },
  { value: "19", unit: "Seconds" }
];

export default function LaunchSection() {
  return (
    <section className="launch-section">
      <div className="container section-shell launch-shell">
        <div className="launch-copy">
          <span className="section-tag">The Countdown Begins</span>
          <h2>Get ready for [Author Name]&apos;s next bestseller launch.</h2>
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
