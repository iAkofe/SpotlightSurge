import express from "express";
import {
  createBook,
  createBookComment,
  deleteBook,
  listBookComments,
  listBooks,
  listMyBooks,
  listPublicBooks
} from "../controllers/book.controller.js";
import { getBook } from "../controllers/book-read.controller.js";
import { asyncHandler } from "../middleware/async.js";
import { requireAuth, requireAuthor, requireRole } from "../middleware/auth.js";
import { uploadRateLimit } from "../middleware/rate-limit.js";
import { validate } from "../middleware/validate.js";
import { bookUpload } from "../middleware/uploads.js";
import { createBookSchema } from "../validators/book.validator.js";
import { createBookCommentSchema } from "../validators/comment.validator.js";
import { idParamSchema } from "../validators/common.validator.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireAuthor,
  uploadRateLimit,
  bookUpload.fields([
    { name: "bookFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  validate(createBookSchema),
  asyncHandler(createBook)
);

router.get("/public", asyncHandler(listPublicBooks));
router.get("/me", requireAuth, requireAuthor, asyncHandler(listMyBooks));
router.get("/:id/comments", validate(idParamSchema), asyncHandler(listBookComments));
router.post(
  "/:id/comments",
  requireAuth,
  requireRole("READER", "AUTHOR", "ADMIN"),
  validate(createBookCommentSchema),
  asyncHandler(createBookComment)
);
router.get("/:id", validate(idParamSchema), asyncHandler(getBook));
router.get("/", requireAuth, asyncHandler(listBooks));
router.delete("/:id", requireAuth, requireAuthor, validate(idParamSchema), asyncHandler(deleteBook));

export default router;
