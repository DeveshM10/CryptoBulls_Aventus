import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
});

export const kycData = pgTable("kyc_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fullName: text("full_name").notNull(),
  pan: text("pan").notNull().unique(),
  dob: date("dob").notNull(),
  address: text("address").notNull(),
  walletAddress: text("wallet_address").notNull(),
  panCardImagePath: text("pan_card_image_path"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  kycData: one(kycData, {
    fields: [users.id],
    references: [kycData.userId],
  }),
}));

export const kycDataRelations = relations(kycData, ({ one }) => ({
  user: one(users, {
    fields: [kycData.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertKycDataSchema = createInsertSchema(kycData, {
  fullName: (schema) => schema.min(3, "Full name must be at least 3 characters"),
  pan: (schema) => schema.regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be in valid format (e.g., ABCDE1234F)"),
  address: (schema) => schema.min(10, "Address must be at least 10 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertKycData = z.infer<typeof insertKycDataSchema>;
export type KycData = typeof kycData.$inferSelect;
