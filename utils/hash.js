import bcrypt from "bcrypt";
import { envVariables } from "../config/envVariables.js";

const SALT_ROUNDS = parseInt(envVariables.BCRYPT_SALT_ROUNDS) || 10;

export const hashPassword = async (password) => {
  if (typeof password !== "string")
    throw new Error("Password must be a string");
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  if (typeof password !== "string")
    throw new Error("Password must be a string");
  return await bcrypt.compare(password, hashedPassword);
};
