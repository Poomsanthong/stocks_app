import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

// Singleton pattern to ensure a single auth instance
let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;

  if (!db) throw new Error("MongoDB connection is not initialized");

  // Prefer explicit BETTER_AUTH_URL; otherwise fall back to common envs or PORT
  const inferredPort = process.env.PORT
    ? `http://localhost:${process.env.PORT}`
    : undefined;
  const rawBaseURL =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    inferredPort ||
    "http://localhost:3000";

  // Validate base URL early to surface misconfiguration (common cause of "Invalid URL")
  let validatedBaseURL = rawBaseURL;
  try {
    const u = new URL(rawBaseURL);
    // Normalize: remove trailing slash for consistency
    validatedBaseURL = u.origin + u.pathname.replace(/\/$/, "");
  } catch (e) {
    console.error("[auth config] Invalid BETTER_AUTH_URL:", rawBaseURL);
    throw new Error(
      `BETTER_AUTH_URL is invalid: "${rawBaseURL}". Set a full URL including protocol, e.g. http://localhost:3000`
    );
  }

  if (!process.env.BETTER_AUTH_SECRET) {
    console.warn(
      "[auth config] BETTER_AUTH_SECRET missing. Define it in .env.local (use a long random string)."
    );
  }

  authInstance = betterAuth({
    database: mongodbAdapter(db as any),
    secret: process.env.BETTER_AUTH_SECRET || "development_secret_change_me",
    baseURL: validatedBaseURL,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    plugins: [nextCookies()],
  });

  console.log(
    "[auth config] Initialized Better Auth with baseURL:",
    validatedBaseURL
  );
  if (!process.env.BETTER_AUTH_URL) {
    console.warn(
      "[auth config] BETTER_AUTH_URL is not set; using inferred URL:",
      validatedBaseURL,
      "(set BETTER_AUTH_URL to silence this message)"
    );
  }

  return authInstance;
};

export const auth = await getAuth();
