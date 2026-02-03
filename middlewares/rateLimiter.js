import rateLimit from "express-rate-limit";
import { envVariables } from "../config/envVariables.js";

const rateLimitHandler = (req, res, next, options) => {
  if (envVariables.NODE_ENV !== "production") {
    console.warn(`Rate limit hit for IP: ${req.ip}`);
  }
  return res.status(options.statusCode).json({
    success: false,
    message: "Too many requests, please try again later.",
  });
};

const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export { globalLimiter, authLimiter };
