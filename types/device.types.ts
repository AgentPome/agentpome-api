import { UUID, DeviceType } from "./common.types";

/**
 * Raw request coming from API
 * ( can be incomplete or invalid ) 
 */
export interface RegisterDeviceRequestType {
    deviceName?: string;
    osName?: string;
    osVersion?: string;
    osArch?: string;
    userId: UUID;
}

/**
 * Internal service-level type
 * ( ALWAYS valid DB-Safe ) 
 */
export interface RegisterDeviceInputType {
    deviceName: string;
    osName: string;
    osVersion: string;
    osArch: string;
    userId: UUID;
}

export interface DeviceResponseType {
    id: UUID;
    deviceName: string;
    deviceType?: DeviceType;
    osName: string;
    osVersion: string;
    osArch: string;
    userId: UUID;
    firstSeenAt: Date;
    lastSeenAt: Date;
}