import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import passport from "passport";
import { config } from "./config.js";
import { prisma } from "./lib/prisma.js";
import { httpLogger, logger } from "./lib/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import authRoutes from "./routes/auth.js";
import authorRoutes from "./routes/authors.js";
import bookRoutes from "./routes/books.js";
import postRoutes from "./routes/posts.js";
import { configureOAuth } from "./services/oauth.service.js";

const app = express();

configureOAuth();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true
  })
);
app.use(cookieParser());
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/api/health", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/posts", postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await prisma.$connect();

  app.listen(config.port, () => {
    logger.info(`SpotlightSurge API running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  logger.error({ err: error }, "Failed to start server");
  process.exit(1);
});
