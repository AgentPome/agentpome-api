import { Request, Response } from "express";
import * as BootStrapService from "../services/bootstrap.services";
import { BootStrapRequestType } from "../types/bootstrap.types";

/**
 * Handle Bootstrap Request
 * POST /bootstrap
 */
export async function bootstrapController(req: Request, res: Response) {

    try {
        const body: BootStrapRequestType = req.body;

        // Validate required fields
        if (!body.userId || !body.deviceName || !body.osName || !body.osVersion || !body.osArch) {
            return res.status(400).json({ pome_code: "missing_fields" });
        }

        const result = await BootStrapService.bootstrap(body);

        return res.status(200).json({
            pome_code: "success",
            data: result
        })
    } catch (err) {
        console.error("[BOOTSTRAP_ERROR]:", err);
        return res.status(500).json({ pome_code: err || "BOOTSRAP_FAILED" });
    }

}