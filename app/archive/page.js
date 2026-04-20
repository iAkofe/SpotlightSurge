import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Archive from "@/components/Archive/Archive";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const metadata = {
  title: "Spotlight Surge | Archive",
  description: "Browse and search all authors and books on Spotlight Surge."
};

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

export default async function ArchivePage() {
  const [authorsData, booksData] = await Promise.all([
    safeFetchJson(`${API_BASE}/api/authors`),
    safeFetchJson(`${API_BASE}/api/books/public`)
  ]);

  const authors = Array.isArray(authorsData?.authors) ? authorsData.authors : [];
  const books = Array.isArray(booksData?.books) ? booksData.books : [];

  return (
    <>
      <Header />
      <main>
        <Archive initialAuthors={authors} initialBooks={books} />
      </main>
      <Footer />
    </>
  );
}

