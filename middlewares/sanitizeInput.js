import xss from "xss";
import { envVariables } from "../config/envVariables.js";

const clean = (data) => {
  if (typeof data === "string") return xss(data.trim());
  if (Array.isArray(data)) return data.map(clean);
  if (data && typeof data === "object" && !Buffer.isBuffer(data)) {
    const cleaned = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        cleaned[key] = clean(data[key]);
      }
    }
    return cleaned;
  }
  return data;
};

export const sanitizeInput = (req, res, next) => {
  try {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.sanitizedQuery = clean(req.query);
    if (req.params) req.sanitizedParams = clean(req.params);
    next();
  } catch (err) {
    if (envVariables.NODE_ENV !== "production")
      console.error("❌ Error sanitizing input:", err);
    return res.status(400).json({
      success: false,
      message: "Invalid input format",
    });
  }
};
