import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import hpp from "hpp";
import OpenAI from "openai";

import { errorHandler } from "./middlewares/globalError.js";
import { sanitizeInput } from "./middlewares/sanitizeInput.js";
import { skipLog } from "./utils/skipLogger.js";
import { authLimiter, globalLimiter } from "./middlewares/rateLimiter.js";
import { envVariables } from "./config/envVariables.js";

import authRoutes from "./routes/auth.routes.js";

import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

if (envVariables.NODE_ENV === "production") {
  app.set("trust proxy", 1);
} else {
  app.set("trust proxy", false);
}

app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(hpp());

app.use(globalLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(sanitizeInput);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev", { skip: skipLog }));
} else {
  app.use(morgan("tiny"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authLimiter, authRoutes);

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, size = "1024x1024" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size,
    });

    const imageUrl = response.data[0].url;

    res.status(200).json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error generating image:", error.message);

    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.use(errorHandler);

export default app;
