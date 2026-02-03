import { envVariables } from "../config/envVariables.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (envVariables.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(envVariables.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
