import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errors.js";
import { uploadBookCover, uploadBookFile } from "../services/upload.service.js";
import { publicBook } from "../utils.js";

export async function createBook(req, res) {
  const { title, description, genre, publishedYear } = req.body;
  const bookFile = req.files?.bookFile?.[0];
  const coverImage = req.files?.coverImage?.[0];

  if (!bookFile) {
    throw new AppError(400, "bookFile is required.");
  }

  const bookFileUrl = await uploadBookFile(bookFile, req.auth.userId);
  const coverImageUrl = coverImage ? await uploadBookCover(coverImage, req.auth.userId) : "";

  const created = await prisma.book.create({
    data: {
      authorId: req.auth.userId,
      title,
      description,
      genre,
      publishedYear,
      bookFileUrl,
      coverImageUrl
    }
  });

  res.status(201).json({ book: publicBook(created) });
}

export async function listMyBooks(req, res) {
  const books = await prisma.book.findMany({
    where: { authorId: req.auth.userId },
    orderBy: { createdAt: "desc" }
  });

  res.json({ books: books.map(publicBook) });
}

export async function listPublicBooks(_req, res) {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          profileImageUrl: true
        }
      }
    }
  });

  res.json({
    books: books.map((book) => ({
      ...publicBook(book),
      author: book.author
    }))
  });
}

export async function listBooks(req, res) {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          role: true,
          profileImageUrl: true
        }
      }
    }
  });

  res.json({ books });
}

export async function deleteBook(req, res) {
  const { id } = req.params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    throw new AppError(404, "Book not found.");
  }

  const canDelete = req.auth.role === "ADMIN" || book.authorId === req.auth.userId;
  if (!canDelete) {
    throw new AppError(403, "Forbidden.");
  }

  await prisma.book.delete({ where: { id } });
  res.status(204).send();
}
