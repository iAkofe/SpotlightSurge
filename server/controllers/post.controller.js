import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errors.js";
import { publicPost } from "../utils.js";

export async function createPost(req, res) {
  const created = await prisma.post.create({
    data: {
      authorId: req.auth.userId,
      title: req.body.title,
      category: req.body.category,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage,
      isPublished: req.body.isPublished
    }
  });

  res.status(201).json({ post: publicPost(created) });
}

export async function listMyPosts(req, res) {
  const posts = await prisma.post.findMany({
    where: { authorId: req.auth.userId },
    orderBy: { createdAt: "desc" }
  });

  res.json({ posts: posts.map(publicPost) });
}

export async function listPosts(req, res) {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
          role: true
        }
      }
    }
  });

  res.json({ posts });
}

export async function listPostsByAuthor(req, res) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: req.params.id,
      isPublished: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json({ posts: posts.map(publicPost) });
}

export async function updatePost(req, res) {
  const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new AppError(404, "Post not found.");
  }

  const canEdit = req.auth.role === "ADMIN" || existing.authorId === req.auth.userId;
  if (!canEdit) {
    throw new AppError(403, "Forbidden.");
  }

  const updated = await prisma.post.update({
    where: { id: req.params.id },
    data: {
      title: req.body.title ?? existing.title,
      category: req.body.category ?? existing.category,
      excerpt: req.body.excerpt ?? existing.excerpt,
      content: req.body.content ?? existing.content,
      coverImage: req.body.coverImage ?? existing.coverImage,
      isPublished: req.body.isPublished ?? existing.isPublished
    }
  });

  res.json({ post: publicPost(updated) });
}

export async function deletePost(req, res) {
  const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    throw new AppError(404, "Post not found.");
  }

  const canDelete = req.auth.role === "ADMIN" || existing.authorId === req.auth.userId;
  if (!canDelete) {
    throw new AppError(403, "Forbidden.");
  }

  await prisma.post.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
