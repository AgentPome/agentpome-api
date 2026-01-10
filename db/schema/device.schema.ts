import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";

export const devices = pgTable("devices", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),

    deviceName: varchar("device_name", { length: 255 }).notNull(),
    osName: varchar("os_name", { length: 100 }).notNull(),
    osVersion: varchar("os_version", { length: 100 }).notNull(),
    osArch: varchar("os_arch", { length: 100 }).notNull(),
    firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
});