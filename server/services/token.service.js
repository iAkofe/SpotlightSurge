import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { REFRESH_COOKIE_NAME } from "../constants/auth.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenTtl }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    config.refreshTokenSecret,
    { expiresIn: config.refreshTokenTtl }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.accessTokenSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshTokenSecret);
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function parseExpiresAt(unixSeconds) {
  return new Date(unixSeconds * 1000);
}

function refreshCookieOptions(expiresAt) {
  const options = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
    path: "/api/auth"
  };

  if (expiresAt) {
    options.expires = expiresAt;
  }

  return options;
}

export function setRefreshCookie(res, value, expiresAt) {
  res.cookie(REFRESH_COOKIE_NAME, value, refreshCookieOptions(expiresAt));
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions(undefined));
}
