import asyncHandler from "express-async-handler";
import {
  signupService,
  loginService,
  googleAuthService,
} from "../services/auth.service.js";

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await signupService({ name, email, password });

  const { password: _, ...safeUser } = user;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: safeUser,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService({ email, password });

  res.status(200).json({
    success: true,
    ...data,
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { id_token } = req.body;
  const data = await googleAuthService({ id_token });

  res.status(200).json({
    success: true,
    ...data,
  });
});
