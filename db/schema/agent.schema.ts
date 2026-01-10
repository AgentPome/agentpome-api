import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { devices } from "./device.schema";
import { agentGroups } from "./agent.groups.schema";

export const wazuhAgents =  pgTable("wazuh_agents", {
    id: uuid("id").primaryKey().defaultRandom(),

    groupId: uuid("group_id")
        .references(() => agentGroups.id),
    
    userId: uuid("user_id").references(() => users.id).notNull(),

    deviceId: uuid("device_id").references(() => devices.id).notNull(),

    agentName: varchar("agent_name", { length: 255 }).notNull(),
    agentVersion: varchar("agent_version", { length: 100 }).notNull(),
    managerIp: varchar("manager_ip", { length: 45 }).notNull(),

    installed: boolean("installed").notNull().default(false),
    running: boolean("running").notNull().default(false),

    assignedAt: timestamp("assigned_at").notNull().defaultNow(),
})