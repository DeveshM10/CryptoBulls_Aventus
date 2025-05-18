import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  walletAddress: text("wallet_address"),
  kycVerified: boolean("kyc_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull(),
  date: text("date").notNull(),
  change: text("change").notNull(),
  trend: text("trend").notNull(), // 'up' or 'down'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const liabilities = pgTable("liabilities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  amount: text("amount").notNull(),
  type: text("type").notNull(),
  interest: text("interest").notNull(),
  payment: text("payment").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull(), // 'current', 'warning', or 'late'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  kycData: one(kycData, {
    fields: [users.id],
    references: [kycData.userId],
  }),
  assets: many(assets),
  liabilities: many(liabilities),
}));

export const kycDataRelations = relations(kycData, ({ one }) => ({
  user: one(users, {
    fields: [kycData.userId],
    references: [users.id],
  }),
}));

export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, {
    fields: [assets.userId],
    references: [users.id],
  }),
}));

export const liabilitiesRelations = relations(liabilities, ({ one }) => ({
  user: one(users, {
    fields: [liabilities.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
});

export const insertKycDataSchema = createInsertSchema(kycData, {
  fullName: (schema) => schema.min(3, "Full name must be at least 3 characters"),
  pan: (schema) => schema.regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be in valid format (e.g., ABCDE1234F)"),
  address: (schema) => schema.min(10, "Address must be at least 10 characters"),
});

export const insertAssetSchema = createInsertSchema(assets, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  value: (schema) => schema.min(1, "Value is required"),
  type: (schema) => schema.min(2, "Type must be at least 2 characters"),
});

export const insertLiabilitySchema = createInsertSchema(liabilities, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  amount: (schema) => schema.min(1, "Amount is required"),
  type: (schema) => schema.min(2, "Type must be at least 2 characters"),
  interest: (schema) => schema.min(1, "Interest rate is required"),
  payment: (schema) => schema.min(1, "Payment amount is required"),
  status: (schema) => z.enum(['current', 'warning', 'late']),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertKycData = z.infer<typeof insertKycDataSchema>;
export type KycData = typeof kycData.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertLiability = z.infer<typeof insertLiabilitySchema>;
export type Liability = typeof liabilities.$inferSelect;
