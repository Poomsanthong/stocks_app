"use server";
import Watchlist, { WatchlistItem } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";
import { Item } from "@radix-ui/react-select";
import { Types } from "mongoose";

interface UserDoc {
  _id: Types.ObjectId;
  email: string;
}

// Function to get watchlist symbols by user email

export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection not found");

    // Better auth stores users in "user" collection
    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (e) {
    console.error("getWatchlistSymbolsByEmail error:", e);
    return [];
  }
}

export const getAllUsersForNewsEmail = async () => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not found");
    }
    const users = await db
      .collection("users")
      .find(
        { email: { $exists: true, $ne: null } },
        {
          projection: {
            id: 1,
            name: 1,
            email: 1,
            newsPreferences: 1,
            country: 1,
          },
        }
      )
      .toArray();

    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id.toString() || "",
        name: user.name,
        email: user.email,
      }));
  } catch (e) {
    console.error("Error fetching users for news email:", e);
    return [];
  }
};
