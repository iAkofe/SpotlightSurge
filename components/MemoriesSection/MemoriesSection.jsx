const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const fallbackMemories = [
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

export default async function MemoriesSection() {
  let memories = fallbackMemories;

  try {
    const response = await fetch(`${API_BASE}/api/posts`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      const posts = Array.isArray(data?.posts) ? data.posts : [];
      const picks = posts.slice(0, 3).map((post, index) => ({
        image: post.coverImage || fallbackMemories[index]?.image,
        alt: post.title || fallbackMemories[index]?.alt,
        copy:
          post.excerpt ||
          `${post.author?.name ? `${post.author.name}: ` : ""}${post.title || "Recent update"}`
      }));

      if (picks.length === 3) {
        memories = picks;
      }
    }
  } catch {}

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
