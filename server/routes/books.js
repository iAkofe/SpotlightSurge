import express from "express";
import { createBook, deleteBook, listBooks, listMyBooks, listPublicBooks } from "../controllers/book.controller.js";
import { asyncHandler } from "../middleware/async.js";
import { requireAuth, requireAuthor } from "../middleware/auth.js";
import { uploadRateLimit } from "../middleware/rate-limit.js";
import { validate } from "../middleware/validate.js";
import { bookUpload } from "../middleware/uploads.js";
import { createBookSchema } from "../validators/book.validator.js";
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
router.get("/", requireAuth, asyncHandler(listBooks));
router.delete("/:id", requireAuth, requireAuthor, validate(idParamSchema), asyncHandler(deleteBook));

export default router;
