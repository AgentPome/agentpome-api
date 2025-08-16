import { pgTable, serial, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
   refreshToken: text("refresh_token").default(""),
   resetToken: text("reset_token").default(""),
    resetExpiresAt : timestamp("reset_expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})