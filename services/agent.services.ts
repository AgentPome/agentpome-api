import crypto from "crypto";
import { db } from "../db/client";
import { wazuhAgents, devices } from "../db/schema";
import { createAgentRequestType } from "../types/agent.types";
import { and, eq } from "drizzle-orm";
import { UUID } from "../types/common.types";

/**
 * Create a Wazuh Agent
 * Server - Controlled Fields
 * - agentName
 * - managerIp
 * - installed
 * - running
 */
export async function createAgent(
    userId: UUID,
    data: createAgentRequestType
) {
    // Ensure device belongs to user
    const [device] = await db
        .select()
        .from(devices)
        .where(
            and(
                eq(devices.id, data.deviceId),
                eq(devices.userId, userId)
            )
        )
    
    if (!device) {
        throw new Error("UNAUTHORIZED");
    }

    // Prevent duplicate device registration
    const [existing] = await db
        .select()
        .from(wazuhAgents)
        .where(eq(wazuhAgents.deviceId, data.deviceId));
    
    if (existing) {
        throw new Error("DEVICE_ALREADY_REGISTERED");
    }

    const agentName = `agent-${crypto.randomUUID().slice(0, 8)}`;
    const managerIp = "95.217.161.25"

    const [agent] = await db
        .insert(wazuhAgents)
        .values({
            userId,
            deviceId: data.deviceId,
            agentName,
            agentVersion: "4.x",
            managerIp,
            installed: false,
            running: false,
            groupId: data.groupId || null,
        }).returning();
    return agent 
}

/**
 * Update agent running status  */
export async function updateAgentStatus(
    agentId: UUID, 
    running: boolean
): Promise<void> {
    await db
        .update(wazuhAgents)
        .set({ running })
        .where(eq(wazuhAgents.id, agentId));
}