import { UUID } from "./common.types";

/**
 * Bootstrap Type for creating device & agent
 */
export interface BootStrapRequestType {
    userId: UUID;
    deviceName: string;
    osName: string;
    osVersion: string;
    osArch: string;
}

export interface BootStrapResponseType {
    userId: UUID;
    deviceId: UUID;
    agentId: UUID;
}