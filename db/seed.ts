import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Create a test user if not exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "testuser"),
    });

    if (!existingUser) {
      console.log("Creating test user...");
      const [user] = await db.insert(schema.users).values({
        username: "testuser",
        password: "password123", // In a real app, this would be hashed
        walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      }).returning();
      
      console.log("Test user created:", user);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
