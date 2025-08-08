import { Router } from "express";
import * as AuthService from "../controllers/auth.controller";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.registerUser(email, password);
    res.status(201)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Refresh-Token", refreshToken)
      .json({ pome_code: "success" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.loginUser(email, password);
    res.status(200)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Refresh-Token", refreshToken)
      .json({ pome_code: "success" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;
  await AuthService.requestPasswordReset(email);
  res.json({ pome_code: "success" });
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, "reset-token": token, password } = req.body;
    await AuthService.resetPassword(email, token, password);
    res.json({ pome_code: "success" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
