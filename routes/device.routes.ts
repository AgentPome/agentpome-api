import { Router } from "express";
import { registerDeviceController } from "../controllers/device.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authMiddleware,registerDeviceController);

export default router;