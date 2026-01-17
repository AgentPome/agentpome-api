import { registerDevice } from "./device.services";
import { createAgent } from "./agent.services";
import { BootStrapRequestType, BootStrapResponseType } from "../types/bootstrap.types";
import { db } from "../db/client";
import { devices, wazuhAgents } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * BootStraps a device + agent for a user
 * - Creates device if not exists
 * - Creats agent if not exists
 * - Returns both
 */
export async function bootstrap(request: BootStrapRequestType): Promise<BootStrapResponseType> {

    const { userId, deviceName, osName,  osVersion, osArch } = request;

    let device;

    // Step 1: Register Device ( or get existing )
    try {
        device = await registerDevice({
            deviceName,
            osName,
            osVersion,
            osArch,
            userId
        });
    } catch (err: any) {
        if (err.message === "DEVICE_ALREADY_REGISTERED") {
            const [existingDevice] = await db
                .select()
                .from(devices)
                .where(
                    eq(devices.deviceName, deviceName)
                )
                .limit(1);
            
            if (!existingDevice) throw new Error("DEVICE_ALREADY_REGISTERED_BUT_NOT_FOUND");
            device = existingDevice;
        } else {
            throw err;
        }
    }

    let agent;

    // Step 2: Register Agent ( or get existing )
    try {
        agent = await createAgent(userId, {
            deviceId: device.id,
            groupId: null
        });
    } catch (err: any) {
        if (err.message === "DEVICE_ALREADY_REGISTERED") {
            const [existingAgent] = await db
                .select()
                .from(wazuhAgents)
                .where(
                    eq(wazuhAgents.deviceId, device.id)
                )
                .limit(1);
            
            if (!existingAgent) throw new Error("AGENT_ALREADY_REGISTERED_BUT_NOT_FOUND");
            agent = existingAgent;
        } else {
            throw err;
        }
    }

    // Step 3: Return both device + agent info
    return {
        userId,
        deviceId: device.id,
        agentId: agent.id
    }

}