import express from "express";
import asyncHandler from "express-async-handler";
import { signup, login, googleAuth } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  loginSchema,
  signupSchema,
  googleSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), asyncHandler(signup));

router.post("/login", validate(loginSchema), asyncHandler(login));

router.post("/google", validate(googleSchema), asyncHandler(googleAuth));

export default router;
