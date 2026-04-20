import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errors.js";
import { publicBook } from "../utils.js";

export async function getBook(req, res) {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true
        }
      }
    }
  });

  if (!book) {
    throw new AppError(404, "Book not found.");
  }

  res.json({
    book: {
      ...publicBook(book),
      author: book.author
    }
  });
}