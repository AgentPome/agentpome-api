import { UUID } from "./common.types";

export interface createAgentRequestType {
    deviceId: UUID;
    groupId?: UUID | null;
}

export interface AgentResponseType {
    id: UUID;

    agentName: string;
    agentGroup: string;

    managerIp: string;

    isInstalled: boolean;
    running: boolean;

    groupId?: UUID | null;

    assignedAt: string;
}