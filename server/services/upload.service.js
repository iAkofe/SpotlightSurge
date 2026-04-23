import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret
});

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });

    stream.end(buffer);
  });
}

function uploadReadable(readable, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });

    readable.on("error", reject);
    readable.pipe(stream);
  });
}

async function uploadFile(file, options) {
  if (file?.buffer) {
    return uploadBuffer(file.buffer, options);
  }

  if (file?.path) {
    const readable = fs.createReadStream(file.path);
    try {
      return await uploadReadable(readable, options);
    } finally {
      await fs.promises.unlink(file.path).catch(() => undefined);
    }
  }

  throw new Error("Missing upload content.");
}

export async function uploadAuthorImage(file, authorId) {
  const result = await uploadFile(file, {
    folder: `spotlightsurge/authors/${authorId}`,
    resource_type: "image"
  });

  return result.secure_url;
}

export async function uploadBookCover(file, authorId) {
  const result = await uploadFile(file, {
    folder: `spotlightsurge/books/${authorId}/covers`,
    resource_type: "image"
  });

  return result.secure_url;
}

export async function uploadBookFile(file, authorId) {
  const originalBaseName = path.parse(file.originalname || "book").name;
  const safeBaseName = originalBaseName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) || "book";
  const publicId = `${safeBaseName}_${crypto.randomUUID()}`;

  const result = await uploadFile(file, {
    folder: `spotlightsurge/books/${authorId}/files`,
    resource_type: "raw",
    public_id: publicId
  });

  return result.secure_url;
}
