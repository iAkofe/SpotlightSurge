import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CommentsWidget from "@/components/CommentsWidget/CommentsWidget";
import PostLikeButton from "@/components/PostLikeButton/PostLikeButton";
import { notFound } from "next/navigation";
import "./PostPage.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function safeFetchJson(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const data = await safeFetchJson(`${API_BASE}/api/posts/${params.id}`);
  if (!data?.post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${data.post.title} | Spotlight Surge`,
    description: data.post.excerpt || data.post.content?.slice(0, 160) || "Read the latest from SpotlightSurge."
  };
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

export default async function PostDetailPage({ params }) {
  const data = await safeFetchJson(`${API_BASE}/api/posts/${params.id}`);
  if (!data?.post) {
    notFound();
  }

  const { post } = data;
  const initials = (post.author?.name || "A").slice(0, 1).toUpperCase();

  return (
    <>
      <Header />
      <main className="post-detail-page">
        <section className="post-detail-hero">
          <div className="post-detail-container">
            <article className="post-detail-card">
              <div className="post-detail-cover">
                {post.coverImage ? <img src={post.coverImage} alt={post.title} /> : <span>No cover image</span>}
              </div>

              <div className="post-detail-body">
                <div className="post-detail-tagline">
                  <span className="post-detail-category">{post.category || "General"}</span>
                  <a className="post-detail-author" href={`/authors/${post.authorId}`}>
                    {post.author?.profileImageUrl ? (
                      <img src={post.author.profileImageUrl} alt={post.author?.name || "Author"} />
                    ) : (
                      <span className="placeholder" aria-hidden="true">
                        {initials}
                      </span>
                    )}
                    <span>{post.author?.name || "Author"}</span>
                  </a>
                  <PostLikeButton postId={post.id} initialLikes={post.likesCount || 0} />
                </div>

                <h1>{post.title}</h1>
                <div className="post-detail-meta">{formatDate(post.createdAt)}</div>
                <div className="post-detail-content">{post.content}</div>

                <CommentsWidget targetType="post" targetId={post.id} />
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
