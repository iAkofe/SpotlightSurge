import AuthorProfile from "@/components/AuthorProfile/AuthorProfile";

export const metadata = {
  title: "Spotlight Surge | Author Profile",
  description: "Explore an author's books, posts, and profile."
};

export default async function AuthorProfilePage({ params }) {
  const { id } = await params;

  return <AuthorProfile authorId={id} />;
}
