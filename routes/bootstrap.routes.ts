import { Router } from "express";
import { bootstrapController } from "../controllers/bootstrap.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * POST /api/v1/bootstrap
 * Body: { userId, deviceName, osName, osVersion, osArch }
 **/
router.post("/", authMiddleware, bootstrapController);

export default router;