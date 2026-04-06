import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errors.js";
import { publicBook, publicPost } from "../utils.js";

export async function getAuthorProfile(req, res) {
  const author = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      location: true,
      website: true,
      profileImageUrl: true,
      createdAt: true
    }
  });

  if (!author || (author.role !== "AUTHOR" && author.role !== "ADMIN")) {
    throw new AppError(404, "Author not found.");
  }

  const [books, posts] = await Promise.all([
    prisma.book.findMany({ where: { authorId: author.id }, orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ where: { authorId: author.id, isPublished: true }, orderBy: { createdAt: "desc" } })
  ]);

  res.json({
    author,
    books: books.map(publicBook),
    posts: posts.map(publicPost),
    stats: {
      books: books.length,
      posts: posts.length
    }
  });
}

export async function listPublicAuthors(req, res) {
  const authors = await prisma.user.findMany({
    where: {
      OR: [{ role: "AUTHOR" }, { role: "ADMIN" }]
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      location: true,
      website: true,
      profileImageUrl: true,
      createdAt: true
    }
  });

  res.json({ authors });
}
