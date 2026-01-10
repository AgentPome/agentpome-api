import { Request, Response } from "express";
import { registerDevice } from "../services/device.services";
import { RegisterDeviceInputType } from "../types/device.types";

export async function registerDeviceController(req: Request, res: Response) {

    try {
        if (!req.user?.id) {
            return res.status(401).json({ pome_code: "unauthorized" });
        }

        const { deviceName, osName, osVersion , osArch } = req.body;

        if (!deviceName || !osName || !osVersion || !osArch) {
            return res.status(400).json({ pome_code: "missing_fields" });
        }

        const input: RegisterDeviceInputType = {
            deviceName,
            osName,
            osVersion,
            osArch,
            userId: req.user.id
        }
        
        const device = await registerDevice(input);

        return res.status(201).json({ pome_code: "success", device });
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
