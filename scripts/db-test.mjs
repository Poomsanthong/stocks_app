import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// Load env vars from .env.local (preferred) or .env if present
async function loadEnv() {
  try {
    const dotenv = await import("dotenv");
    const cwd = process.cwd();
    const localPath = path.resolve(cwd, ".env.local");
    const envPath = path.resolve(cwd, ".env");
    if (fs.existsSync(localPath)) {
      dotenv.config({ path: localPath });
      console.log("[db-test] Loaded .env.local");
    } else if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log("[db-test] Loaded .env");
    } else {
      console.warn(
        "[db-test] No .env.local or .env file found; relying on process env"
      );
    }
  } catch (e) {
    console.warn("[db-test] dotenv not available; relying on process env");
  }
}

await loadEnv();

const URI = process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!URI) {
  console.error(
    "❌ Missing MongoDB connection string. Set MONGODB_URI (or MONGODB_URL) in .env.local or environment."
  );
  process.exit(1);
}

console.log(`[db-test] Connecting to MongoDB...`);

try {
  await mongoose.connect(URI, { bufferCommands: false });
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection is not initialized");

  const ping = await db.admin().ping();
  console.log("✅ MongoDB connected", {
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    readyState: mongoose.connection.readyState,
    ping,
  });
  process.exitCode = 0;
} catch (err) {
  console.error("❌ MongoDB connection failed");
  console.error(err?.message || err);
  process.exitCode = 1;
} finally {
  try {
    await mongoose.disconnect();
  } catch {}
}
