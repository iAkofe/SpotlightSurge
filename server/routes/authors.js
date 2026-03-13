import express from "express";
import { getAuthorProfile, listPublicAuthors } from "../controllers/author.controller.js";
import { asyncHandler } from "../middleware/async.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.validator.js";

const router = express.Router();

router.get("/", asyncHandler(listPublicAuthors));
router.get("/:id", validate(idParamSchema), asyncHandler(getAuthorProfile));

export default router;
