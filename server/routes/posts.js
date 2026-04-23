import express from "express";
import {
  createPost,
  createPostComment,
  deletePost,
  getPost,
  listMyPosts,
  listPostComments,
  listPosts,
  listPostsByAuthor,
  togglePostLike,
  updatePost
} from "../controllers/post.controller.js";
import { asyncHandler } from "../middleware/async.js";
import { requireAuth, requireAuthor, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createPostCommentSchema } from "../validators/comment.validator.js";
import { createPostSchema, updatePostSchema } from "../validators/post.validator.js";

const router = express.Router();

router.get("/", asyncHandler(listPosts));
router.get("/author/:id", validate(idParamSchema), asyncHandler(listPostsByAuthor));
router.get("/me", requireAuth, requireAuthor, asyncHandler(listMyPosts));
router.post("/", requireAuth, requireAuthor, validate(createPostSchema), asyncHandler(createPost));
router.get("/:id", validate(idParamSchema), asyncHandler(getPost));
router.get("/:id/comments", validate(idParamSchema), asyncHandler(listPostComments));
router.post(
  "/:id/comments",
  requireAuth,
  requireRole("READER", "AUTHOR", "ADMIN"),
  validate(createPostCommentSchema),
  asyncHandler(createPostComment)
);
router.post("/:id/like", requireAuth, validate(idParamSchema), asyncHandler(togglePostLike));
router.put("/:id", requireAuth, requireAuthor, validate(updatePostSchema), asyncHandler(updatePost));
router.delete("/:id", requireAuth, requireAuthor, validate(idParamSchema), asyncHandler(deletePost));

export default router;
