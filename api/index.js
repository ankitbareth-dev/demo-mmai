import app from "../app.js";
import { envVariables } from "../config/envVariables.js";
import prisma from "../config/prismaClient.js";

if (envVariables.NODE_ENV !== "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

export default app;
