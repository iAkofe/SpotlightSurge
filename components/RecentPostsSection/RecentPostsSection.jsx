const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function RecentPostsSection() {
  let posts = [];

  try {
    const response = await fetch(`${API_BASE}/api/posts`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      posts = Array.isArray(data?.posts) ? data.posts : [];
    }
  } catch (error) {
    console.error("Failed to fetch recent posts:", error);
  }

  // Only take top 3 recent posts
  const recentPosts = posts.slice(0, 3);

  if (recentPosts.length === 0) return null;

  return (
    <section id="recent-posts" className="recent-posts-section">
      <div className="container">
        <div className="section-title">
          <span className="section-tag">Community Voices</span>
          <h2>Recent Posts</h2>
          <p>Read the latest thoughts, updates, and stories from our authors.</p>
        </div>
        <div className="recent-posts-grid">
          {recentPosts.map((post) => (
            <article key={post.id} className="post-card">
              <a href={`/posts/${post.id}`} className="post-card-link">
                {post.coverImage && (
                  <div className="post-cover">
                    <img src={post.coverImage} alt={post.title} />
                  </div>
                )}
                <div className="post-content">
                  <span className="post-category">{post.category || "General"}</span>
                  <h3>{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <div className="post-author">
                      {post.author?.profileImageUrl ? (
                        <img src={post.author.profileImageUrl} alt={post.author.name} />
                      ) : (
                        <div className="post-author-placeholder">
                          {post.author?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <span>{post.author?.name || "Unknown Author"}</span>
                    </div>
                    <time className="post-date">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}