import { config } from "dotenv";
config();

function requireEnvVar(name) {
  const value = process.env[name];
  if (value === undefined || value === null || value === "") {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const envVariables = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: requireEnvVar("DATABASE_URL"),
  JWT_SECRET: requireEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: requireEnvVar("JWT_EXPIRES_IN"),
  BCRYPT_SALT_ROUNDS: requireEnvVar("BCRYPT_SALT_ROUNDS"),
  DIRECT_URL: requireEnvVar("DIRECT_URL"),
  GOOGLE_CLIENT_ID: requireEnvVar("GOOGLE_CLIENT_ID"),
  NODE_ENV: process.env.NODE_ENV || "development",
};
