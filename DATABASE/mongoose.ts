import mongoose from "mongoose";

// Support both common env names and prefer MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

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
  if (!MONGODB_URI) {
    throw new Error(
      "Missing MongoDB connection string. Set MONGODB_URI (preferred) or MONGODB_URL in .env.local."
    );
  }

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

export const pingDatabase = async () => {
  const conn = await connectToDatabase();
  const db = conn.connection.db;
  if (!db) throw new Error("MongoDB connection is not initialized");
  const admin = db.admin();
  return admin.ping();
};
