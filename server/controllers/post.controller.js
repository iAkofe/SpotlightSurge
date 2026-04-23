import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errors.js";
import { publicComment, publicPost } from "../utils.js";

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
      },
      _count: {
        select: {
          likes: true
        }
      }
    }
  });

  res.json({
    posts: posts.map((post) => ({
      ...publicPost(post),
      author: post.author,
      likesCount: post._count.likes
    }))
  });
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

export async function getPost(req, res) {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
          role: true
        }
      },
      _count: {
        select: {
          likes: true
        }
      }
    }
  });

  if (!post || !post.isPublished) {
    throw new AppError(404, "Post not found.");
  }

  res.json({
    post: {
      ...publicPost(post),
      author: post.author,
      likesCount: post._count.likes
    }
  });
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

export async function listPostComments(req, res) {
  const post = await prisma.post.findUnique({ where: { id: req.params.id }, select: { id: true, isPublished: true } });
  if (!post || !post.isPublished) {
    throw new AppError(404, "Post not found.");
  }

  const comments = await prisma.comment.findMany({
    where: { postId: req.params.id },
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

export async function createPostComment(req, res) {
  const post = await prisma.post.findUnique({ where: { id: req.params.id }, select: { id: true, isPublished: true } });
  if (!post || !post.isPublished) {
    throw new AppError(404, "Post not found.");
  }

  const created = await prisma.comment.create({
    data: {
      postId: req.params.id,
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

export async function togglePostLike(req, res) {
  const post = await prisma.post.findUnique({ where: { id: req.params.id }, select: { id: true, isPublished: true } });
  if (!post || !post.isPublished) {
    throw new AppError(404, "Post not found.");
  }

  const existing = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: req.params.id,
        userId: req.auth.userId
      }
    }
  });

  let liked = false;
  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    liked = false;
  } else {
    await prisma.postLike.create({
      data: {
        postId: req.params.id,
        userId: req.auth.userId
      }
    });
    liked = true;
  }

  const likesCount = await prisma.postLike.count({ where: { postId: req.params.id } });
  res.json({ liked, likesCount });
}
