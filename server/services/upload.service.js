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

export async function uploadAuthorImage(file, authorId) {
  const result = await uploadBuffer(file.buffer, {
    folder: `spotlightsurge/authors/${authorId}`,
    resource_type: "image"
  });

  return result.secure_url;
}

export async function uploadBookCover(file, authorId) {
  const result = await uploadBuffer(file.buffer, {
    folder: `spotlightsurge/books/${authorId}/covers`,
    resource_type: "image"
  });

  return result.secure_url;
}

export async function uploadBookFile(file, authorId) {
  const result = await uploadBuffer(file.buffer, {
    folder: `spotlightsurge/books/${authorId}/files`,
    resource_type: "raw",
    public_id: file.originalname.replace(/\.[^/.]+$/, "")
  });

  return result.secure_url;
}
