import { pgTable, serial, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("Users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    refreshToken: text("refresh_token"),
    resetToken: text("reset_token"),
    resetExpiresAt : timestamp("reset_expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})