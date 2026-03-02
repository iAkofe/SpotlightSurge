import { prisma } from "../lib/prisma.js";
import {
  clearRefreshCookie,
  hashToken,
  parseExpiresAt,
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "./token.service.js";
import { AppError } from "../middleware/errors.js";
import { REFRESH_COOKIE_NAME } from "../constants/auth.js";

export async function issueSession(user, res) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(500, "Failed to mint refresh token.");
  }

  const exp = typeof payload === "object" ? payload.exp : null;
  if (!exp || typeof exp !== "number") {
    throw new AppError(500, "Failed to calculate refresh token expiry.");
  }

  const expiresAt = parseExpiresAt(exp);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt
    }
  });

  setRefreshCookie(res, refreshToken, expiresAt);
  return accessToken;
}

export async function revokeSessionByCookie(req) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export function clearSessionCookie(res) {
  clearRefreshCookie(res);
}
