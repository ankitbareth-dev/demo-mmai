import jwt from "jsonwebtoken";
import { envVariables } from "../config/envVariables.js";

const JWT_SECRET = envVariables.JWT_SECRET;
const JWT_EXPIRES_IN = envVariables.JWT_EXPIRES_IN || "7d";

export const generateToken = (user) => {
  try {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error("JWT generation failed:", err);
    throw new Error("Failed to generate token");
  }
};
