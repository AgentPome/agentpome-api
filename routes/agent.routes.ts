import { Router } from "express";
import { createAgentController } from "../controllers/agent.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createAgentController);

export default router;