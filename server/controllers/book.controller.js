import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errors.js";
import { uploadBookCover, uploadBookFile } from "../services/upload.service.js";
import { publicBook, publicComment } from "../utils.js";

export async function createBook(req, res) {
  const { title, description, genre, publishedYear, purchaseLink, snippet } = req.body;
  const bookFile = req.files?.bookFile?.[0];
  const coverImage = req.files?.coverImage?.[0];

  const bookFileUrl = bookFile ? await uploadBookFile(bookFile, req.auth.userId) : "";
  const coverImageUrl = coverImage ? await uploadBookCover(coverImage, req.auth.userId) : "";

  const created = await prisma.book.create({
    data: {
      authorId: req.auth.userId,
      title,
      description,
      genre,
      publishedYear,
      purchaseLink,
      snippet,
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

export async function listBookComments(req, res) {
  const { id } = req.params;
  const book = await prisma.book.findUnique({ where: { id }, select: { id: true } });
  if (!book) {
    throw new AppError(404, "Book not found.");
  }

  const comments = await prisma.comment.findMany({
    where: { bookId: id },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
          role: true
        }
      }
    }
  });

  res.json({
    comments: comments.map((comment) => ({
      ...publicComment(comment),
      user: comment.user
    }))
  });
}

export async function createBookComment(req, res) {
  const { id } = req.params;
  const book = await prisma.book.findUnique({ where: { id }, select: { id: true } });
  if (!book) {
    throw new AppError(404, "Book not found.");
  }

  const created = await prisma.comment.create({
    data: {
      bookId: id,
      userId: req.auth.userId,
      content: req.body.content
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
          role: true
        }
      }
    }
  });

  res.status(201).json({
    comment: {
      ...publicComment(created),
      user: created.user
    }
  });
}
