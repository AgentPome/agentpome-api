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

export async function getdetails(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const userData = await AuthService.getDetailsById(userId);
    return res.status(200).json(userData);
  } catch (err) {
    return res.status(401).json({ error: (err as Error).message });
  }
}

import { requireRefreshHeaders } from "../middleware/auth.middleware";

export async function refresh(req: Request, res: Response) {
  try {
    const accessTokenRaw = (req as any).accessTokenRaw;
    const refreshTokenRaw = (req as any).refreshTokenRaw;

    const { accessToken, refreshToken } = await AuthService.refreshTokens(
      accessTokenRaw,
      refreshTokenRaw
    );

    res.status(200)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Refresh-Token", refreshToken)
      .json({ pome_code: "success" });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
}


