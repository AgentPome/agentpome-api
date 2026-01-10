import { db } from "../db/client";
import { devices } from "../db/schema";
import { RegisterDeviceInputType } from "../types/device.types";
import { eq, and } from "drizzle-orm";

export async function registerDevice(data: RegisterDeviceInputType) { 
    
    // Prevent duplicate device registration for the same user
    const existing = await db
        .select()
        .from(devices)
        .where(
            and(
                eq(devices.deviceName, data.deviceName),
                eq(devices.userId, data.userId)
            )
        )
        .limit(1);
            
    if (existing.length > 0) {
        throw new Error("DEVICE_ALREADY_REGISTERED");
    }

    const [device] = await db
        .insert(devices)
        .values({
            deviceName: data.deviceName,
            osName: data.osName,
            osVersion: data.osVersion,
            osArch: data.osArch,
            userId: data.userId
        })
        .returning();

    return device;

}