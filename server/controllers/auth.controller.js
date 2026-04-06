import bcrypt from "bcryptjs";
import { REFRESH_COOKIE_NAME } from "../constants/auth.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errors.js";
import { uploadAuthorImage } from "../services/upload.service.js";
import { hashToken, verifyRefreshToken } from "../services/token.service.js";
import { clearSessionCookie, issueSession, revokeSessionByCookie } from "../services/session.service.js";
import { publicUser } from "../utils.js";

export async function register(req, res) {
  const { name, email, password, accountType, bio, location, website } = req.body;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new AppError(409, "Email is already registered.");
  }

  const isAuthor = accountType === "author";
  const passwordHash = await bcrypt.hash(password, 12);

  let user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role: isAuthor ? "AUTHOR" : "READER",
      bio: isAuthor ? bio : "",
      location: isAuthor ? location : "",
      website: isAuthor ? website : ""
    }
  });

  if (isAuthor && req.file) {
    const profileImageUrl = await uploadAuthorImage(req.file, user.id);
    user = await prisma.user.update({
      where: { id: user.id },
      data: { profileImageUrl }
    });
  }

  const accessToken = await issueSession(user, res);
  res.status(201).json({ accessToken, user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid credentials.");
  }

  const accessToken = await issueSession(user, res);
  res.json({ accessToken, user: publicUser(user) });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    throw new AppError(401, "Missing refresh token.");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, "Refresh token is invalid.");
  }

  const userId = typeof decoded === "object" ? decoded.sub : null;
  if (!userId || typeof userId !== "string") {
    throw new AppError(401, "Refresh token is invalid.");
  }

  const tokenHash = hashToken(refreshToken);
  const persisted = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!persisted || persisted.revokedAt || persisted.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token is invalid.");
  }

  await prisma.refreshToken.update({
    where: { id: persisted.id },
    data: { revokedAt: new Date() }
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(401, "User not found.");
  }

  const accessToken = await issueSession(user, res);
  res.json({ accessToken, user: publicUser(user) });
}

export async function logout(req, res) {
  await revokeSessionByCookie(req);
  clearSessionCookie(res);
  res.status(204).send();
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.auth.userId } });
  if (!user) {
    throw new AppError(404, "User not found.");
  }

  res.json({ user: publicUser(user) });
}

export async function updateMe(req, res) {
  const current = await prisma.user.findUnique({ where: { id: req.auth.userId } });
  if (!current) {
    throw new AppError(404, "User not found.");
  }

  let profileImageUrl = current.profileImageUrl;
  if (req.file && (current.role === "AUTHOR" || current.role === "ADMIN")) {
    profileImageUrl = await uploadAuthorImage(req.file, current.id);
  }

  const updated = await prisma.user.update({
    where: { id: current.id },
    data: {
      name: req.body.name ?? current.name,
      bio: req.body.bio ?? current.bio,
      location: req.body.location ?? current.location,
      website: req.body.website ?? current.website,
      profileImageUrl
    }
  });

  res.json({ user: publicUser(updated) });
}

export async function upgradeToAuthor(req, res) {
  const current = await prisma.user.findUnique({ where: { id: req.auth.userId } });
  if (!current) {
    throw new AppError(404, "User not found.");
  }

  if (current.role === "AUTHOR" || current.role === "ADMIN") {
    throw new AppError(409, "Account is already an author account.");
  }

  let profileImageUrl = current.profileImageUrl;
  if (req.file) {
    profileImageUrl = await uploadAuthorImage(req.file, current.id);
  }

  const upgraded = await prisma.user.update({
    where: { id: current.id },
    data: {
      role: "AUTHOR",
      bio: req.body.bio || current.bio,
      location: req.body.location || current.location,
      website: req.body.website || current.website,
      profileImageUrl
    }
  });

  res.json({
    message: "Account upgraded to author. This change cannot be reverted.",
    user: publicUser(upgraded)
  });
}

export async function listAuthors(req, res) {
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
