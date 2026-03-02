import { AppError } from "./errors.js";
import { verifyAccessToken } from "../services/token.service.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(new AppError(401, "Missing or invalid authorization token."));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email
    };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token."));
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      next(new AppError(403, "Forbidden."));
      return;
    }
    next();
  };
}

export function requireAuthor(req, res, next) {
  if (!req.auth || (req.auth.role !== "AUTHOR" && req.auth.role !== "ADMIN")) {
    next(new AppError(403, "Author account required."));
    return;
  }
  next();
}
