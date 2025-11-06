import mongoose from "mongoose";

// Support both common env names
import mongoose from "mongoose";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  // Support both common env names
  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

  if (!MONGODB_URI)
    throw new Error(
      "Missing MongoDB connection string. Set MONGODB_URI (or MONGODB_URL) in your environment (e.g., .env.local)."
    );

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (!MONGODB_URI)
    throw new Error(
      "Missing MongoDB connection string. Set MONGODB_URI (or MONGODB_URL) in your environment (e.g., .env.local)."
    );

  if (cached.conn) {
    return cached.conn;
  } else {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
      cached.conn = await cached.promise;
    } catch (err) {
      cached.promise = null;
      throw err;
    }
  }

  console.log(
    `MongoDB connected in ${process.env.NODE_ENV} to ${mongoose.connection.host}/${mongoose.connection.name}`
  );

  return cached.conn;
};
