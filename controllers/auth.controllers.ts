import { Request, Response } from "express";
import * as AuthService from "../services/auth.services"; // assuming your service file

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.registerUser({ email, password });
    res.status(201)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Refresh-Token", refreshToken)
      .json({ pome_code: "success" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.loginUser({ email, password });
    res.status(200)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Refresh-Token", refreshToken)
      .json({ pome_code: "success" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function resetPasswordRequest(req: Request, res: Response) {
  try {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);
    res.json({ pome_code: "success" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, "reset-token": token, password } = req.body;
    await AuthService.resetPassword(email, token, password);
    res.json({ pome_code: "success" });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}
