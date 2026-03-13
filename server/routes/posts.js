import express from "express";
import {
  createPost,
  deletePost,
  listMyPosts,
  listPosts,
  listPostsByAuthor,
  updatePost
} from "../controllers/post.controller.js";
import { asyncHandler } from "../middleware/async.js";
import { requireAuth, requireAuthor } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";
import { createPostSchema, updatePostSchema } from "../validators/post.validator.js";

const router = express.Router();

router.get("/", asyncHandler(listPosts));
router.get("/author/:id", validate(idParamSchema), asyncHandler(listPostsByAuthor));
router.get("/me", requireAuth, requireAuthor, asyncHandler(listMyPosts));
router.post("/", requireAuth, requireAuthor, validate(createPostSchema), asyncHandler(createPost));
router.put("/:id", requireAuth, requireAuthor, validate(updatePostSchema), asyncHandler(updatePost));
router.delete("/:id", requireAuth, requireAuthor, validate(idParamSchema), asyncHandler(deletePost));

export default router;
