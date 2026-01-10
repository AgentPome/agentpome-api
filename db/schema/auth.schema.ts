import { pgTable, serial, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const userPlanEnum = pgEnum("user_plan", [
    "FREE",
    "INDIVIDUAL",
    "PRO",
    "PREMIUM"
])

export const users = pgTable("Users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    plan: userPlanEnum("plan").notNull().default("FREE"),
    refreshToken: text("refresh_token"),
    resetToken: text("reset_token"),
    resetExpiresAt : timestamp("reset_expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})