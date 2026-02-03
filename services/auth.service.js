import {
  findUserByEmail,
  findUserByGoogleId,
  createUser,
  updateUser,
} from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { verifyGoogleToken } from "../utils/googleVerify.js";

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const signupService = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new AppError("User already exists", 400);

  const hashed = await hashPassword(password);
  const user = await createUser({
    name,
    email,
    password: hashed,
    provider: "local",
  });

  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new AppError("Invalid credentials", 401);

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};

export const googleAuthService = async ({ id_token }) => {
  const payload = await verifyGoogleToken(id_token);

  if (!payload || !payload.email)
    throw new AppError("Invalid Google token", 400);
  if (!payload.email_verified) {
    // optional: you can allow unverified emails but generally it's safer to require verified.
    // throw new AppError("Google email not verified", 400);
  }

  const { email, googleId, name, avatar } = payload;

  let user = null;

  if (googleId) {
    user = await findUserByGoogleId(googleId);
  }

  if (!user) {
    user = await findUserByEmail(email);
  }

  if (user) {
    if (!user.googleId) {
      user = await updateUser(user.id, {
        googleId,
        avatar,
        provider: "google",
      });
    }
  } else {
    user = await createUser({
      name,
      email,
      password: null,
      provider: "google",
      googleId,
      avatar,
    });
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};
