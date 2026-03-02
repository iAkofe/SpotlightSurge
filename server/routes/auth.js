import express from "express";
import passport from "passport";
import {
  listAuthors,
  login,
  logout,
  me,
  refresh,
  register,
  updateMe,
  upgradeToAuthor
} from "../controllers/auth.controller.js";
import { asyncHandler } from "../middleware/async.js";
import { requireAuth } from "../middleware/auth.js";
import { authRateLimit } from "../middleware/rate-limit.js";
import { validate } from "../middleware/validate.js";
import { authorImageUpload } from "../middleware/uploads.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  upgradeToAuthorSchema
} from "../validators/auth.validator.js";
import { AppError } from "../middleware/errors.js";
import { ensureOAuthEnabled, oauthCallbackHandler } from "../services/oauth.service.js";

const router = express.Router();

router.post(
  "/register",
  authRateLimit,
  authorImageUpload.single("profileImage"),
  validate(registerSchema),
  asyncHandler(register)
);

router.post("/login", authRateLimit, validate(loginSchema), asyncHandler(login));
router.post("/refresh", authRateLimit, asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));

router.get("/me", requireAuth, asyncHandler(me));
router.put(
  "/me",
  requireAuth,
  authorImageUpload.single("profileImage"),
  validate(updateProfileSchema),
  asyncHandler(updateMe)
);

router.post(
  "/upgrade-to-author",
  requireAuth,
  authorImageUpload.single("profileImage"),
  validate(upgradeToAuthorSchema),
  asyncHandler(upgradeToAuthor)
);

router.get("/authors", requireAuth, asyncHandler(listAuthors));

router.get("/oauth/google", (req, res, next) => {
  if (!ensureOAuthEnabled("google")) {
    next(new AppError(503, "Google OAuth is not configured."));
    return;
  }
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

router.get("/oauth/google/callback", (req, res, next) => {
  if (!ensureOAuthEnabled("google")) {
    next(new AppError(503, "Google OAuth is not configured."));
    return;
  }

  passport.authenticate("google", { session: false }, oauthCallbackHandler(req, res, next))(req, res, next);
});

router.get("/oauth/facebook", (req, res, next) => {
  if (!ensureOAuthEnabled("facebook")) {
    next(new AppError(503, "Facebook OAuth is not configured."));
    return;
  }

  passport.authenticate("facebook", { scope: ["email"], session: false })(req, res, next);
});

router.get("/oauth/facebook/callback", (req, res, next) => {
  if (!ensureOAuthEnabled("facebook")) {
    next(new AppError(503, "Facebook OAuth is not configured."));
    return;
  }

  passport.authenticate("facebook", { session: false }, oauthCallbackHandler(req, res, next))(req, res, next);
});

export default router;
