import { ZodError } from "zod";

export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Route not found." });
}

export function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed.",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
    return;
  }

  if (error?.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({ error: "Uploaded file is too large." });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  req.log.error({ err: error }, "Unhandled server error");
  res.status(500).json({ error: "Internal server error." });
}
