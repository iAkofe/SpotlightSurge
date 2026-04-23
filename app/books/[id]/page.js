import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CommentsWidget from "@/components/CommentsWidget/CommentsWidget";
import { notFound } from "next/navigation";
import { ArrowRight, Globe, MapPin } from "lucide-react";
import "./BookPage.css";

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
  const data = await safeFetchJson(`${API_BASE}/api/books/${params.id}`);
  if (!data?.book) {
    return { title: "Book Not Found" };
  }

  return {
    title: `${data.book.title} by ${data.book.author.name} | Spotlight Surge`,
    description: data.book.description || `Read a snippet of ${data.book.title}.`
  };
}

export default async function BookSnippetPage({ params }) {
  const data = await safeFetchJson(`${API_BASE}/api/books/${params.id}`);
  
  if (!data?.book) {
    notFound();
  }

  const { book } = data;

  return (
    <>
      <Header />
      <main className="book-snippet-page">
        <section className="book-snippet-hero">
          <div className="book-snippet-container">
            <div className="book-hero-grid">
              <div className="book-hero-cover">
                {book.coverImageUrl ? (
                  <img src={book.coverImageUrl} alt={book.title} />
                ) : (
                  <div className="book-cover-placeholder">No Cover</div>
                )}
              </div>
              
              <div className="book-hero-content">
                <span className="book-genre-tag">{book.genre || "Book"}</span>
                <h1>{book.title}</h1>
                
                <div className="book-author-strip">
                  <a href={`/authors/${book.authorId}`} className="book-author-link">
                    <div className="book-author-avatar">
                      {book.author.profileImageUrl ? (
                        <img src={book.author.profileImageUrl} alt={book.author.name} />
                      ) : (
                        <span>{book.author.name.charAt(0)}</span>
                      )}
                    </div>
                    <span>By <strong>{book.author.name}</strong></span>
                  </a>
                </div>

                <div className="book-description">
                  <h3>About the book</h3>
                  <p>{book.description || "No description provided."}</p>
                </div>

                <div className="book-actions-bar">
                  {book.purchaseLink ? (
                    <a href={book.purchaseLink} target="_blank" rel="noreferrer" className="btn-buy-book">
                      Buy Full Book <Globe size={16} />
                    </a>
                  ) : null}
                  {book.bookFileUrl && !book.snippet ? (
                    <a href={book.bookFileUrl} target="_blank" rel="noreferrer" className="btn-read-free">
                      Read Full Book <ArrowRight size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {book.snippet && (
          <section className="book-snippet-content">
            <div className="book-snippet-container narrow">
              <div className="snippet-header">
                <h2>Free Preview</h2>
                <div className="snippet-divider"></div>
              </div>
              
              <div className="snippet-text">
                {book.snippet.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="snippet-footer">
                <p>End of preview.</p>
                {book.purchaseLink && (
                  <a href={book.purchaseLink} target="_blank" rel="noreferrer" className="btn-buy-book">
                    Buy Book to Continue Reading
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="book-snippet-content">
          <div className="book-snippet-container narrow">
            <CommentsWidget targetType="book" targetId={book.id} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
