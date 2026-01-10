import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean
} from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { create } from "domain";

export const agentGroups = pgTable("agent_groups", {
    id: uuid("id").primaryKey().defaultRandom(),

    ownerId: uuid("owner_id")
        .references(() => users.id)
        .notNull(),

    groupName: varchar("group_name", { length: 255 }).notNull(),

    plan: varchar("plan", { length: 20 }).notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
})