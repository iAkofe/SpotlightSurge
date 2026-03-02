import multer from "multer";
import { AppError } from "./errors.js";

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const bookMimeTypes = new Set([
  "application/pdf",
  "application/epub+zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const storage = multer.memoryStorage();

function filterAuthorImage(req, file, cb) {
  if (!imageMimeTypes.has(file.mimetype)) {
    cb(new AppError(400, "profileImage must be a valid image file."));
    return;
  }
  cb(null, true);
}

function filterBookUploads(req, file, cb) {
  if (file.fieldname === "coverImage" && !imageMimeTypes.has(file.mimetype)) {
    cb(new AppError(400, "coverImage must be a valid image file."));
    return;
  }

  if (file.fieldname === "bookFile" && !bookMimeTypes.has(file.mimetype)) {
    cb(new AppError(400, "bookFile must be PDF, EPUB, DOC, or DOCX."));
    return;
  }

  cb(null, true);
}

export const authorImageUpload = multer({
  storage,
  fileFilter: filterAuthorImage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const bookUpload = multer({
  storage,
  fileFilter: filterBookUploads,
  limits: { fileSize: 50 * 1024 * 1024 }
});
