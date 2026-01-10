import { Request, Response } from "express";
import * as AgentService from "../services/agent.services";
import { createAgentRequestType } from "../types/agent.types";

/**
 * POST /agents
 */
export async function createAgentController(req: Request, res: Response) {

    try {

      if (!req.user) {
          return res.status(401).json({ pome_code: "UNAUTHORIZED" });
      }

      const body = req.body as createAgentRequestType;

      if (!body.deviceId) {
          return res.status(400)
            .json({
              pome_code: "missing_fields"
            })
      }

        const agent = await AgentService.createAgent(
          req.user.id,
          body
        )

        return res.status(201)
          .json({
            pome_code: "success",
            agent: {
              id: agent.id,
              agentName: agent.agentName,
              agentGroup: agent.groupId,
              managerIp: agent.managerIp,
              isInstalled: agent.installed,
              running: agent.running,
              groupId: agent.groupId,
              assignedAt: agent.assignedAt.toISOString(),
            },
          });

    } catch (err) {
        return handleError(res, err);
    }
}


function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    switch (err.message) {
      case "AGENT_ALREADY_EXISTS":
        return res.status(409).json({ pome_code: "agent_exists" });

      case "DEVICE_ALREADY_REGISTERED":
        return res.status(409).json({ pome_code: "device_exists" });

      case "PLAN_LIMIT_REACHED":
        return res.status(403).json({ pome_code: "plan_limit_reached" });

      case "UNAUTHORIZED":
        return res.status(401).json({ pome_code: "unauthorized" });

      default:
        return res.status(400).json({ pome_code: "bad_request" });
    }
  }

  return res.status(500).json({ pome_code: "server_error" });
}
