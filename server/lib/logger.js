import pino from "pino";
import pinoHttp from "pino-http";
import { config } from "../config.js";

const redaction = {
  paths: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.headers.set-cookie",
    "res.headers.set-cookie",
    "req.query.accessToken",
    "req.query.refreshToken"
  ],
  remove: true
};

export const logger = pino({
  level: config.env === "production" ? "info" : "debug",
  redact: redaction
});

export const httpLogger = pinoHttp({
  logger,
  redact: redaction
});
