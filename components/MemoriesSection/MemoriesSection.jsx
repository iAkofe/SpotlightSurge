const memories = [
  {
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=80",
    alt: "Past event audience during reading",
    copy: "Author reading and audience Q&A session from our spring series."
  },
  {
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80",
    alt: "Bookshelf event setup",
    copy: "Community launch night featuring independent authors and local book clubs."
  },
  {
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1000&q=80",
    alt: "Readers discussing books at event table",
    copy: "Roundtable discussion exploring story craft, publishing journeys, and reader trends."
  }
];

export default function MemoriesSection() {
  return (
    <section className="memories-section">
      <div className="container section-shell memories-shell">
        <div className="section-title">
          <span className="section-tag">Relive the Magic of Past Events</span>
          <h2>From intimate author talks to grand launches, revisit the moments.</h2>
        </div>
        <div className="memory-grid">
          {memories.map((memory) => (
            <article className="memory-card" key={memory.image}>
              <img src={memory.image} alt={memory.alt} />
              <p>{memory.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
