import { Request, Response } from "express";
import * as AuthService from "../services/auth.services"; // assuming your service file

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ pome_code: "missing_fields" });
    }
    const response = await AuthService.registerUser({ email, password });

    return res.status(201).json({
      pome_code: "success",
      data: response
    })
  } catch (err) {
    return handleError(res, err);
    // res.status(400).json({ error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ pome_code: "missing_fields" });
    }
    const response = await AuthService.loginUser({ email, password });

    return res.status(200).json({
      pome_code: "success",
      data: response
    })
  } catch (err) {
    return handleError(res, err);
    // res.status(400).json({ error: (err as Error).message });
  }
}

export async function resetPasswordRequest(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ pome_code: "missing_fields" });
    }
    await AuthService.requestPasswordReset(email);
    res.json({ pome_code: "success" });
  } catch (err) {
    return handleError(res, err);
    // res.status(400).json({ error: (err as Error).message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, resetToken, password } = req.body;
    if (!email || !resetToken || !password) {
      return res.status(400).json({ pome_code: "missing_fields" });
    }
    await AuthService.resetPassword(email, resetToken, password);
    res.json({ pome_code: "success" });
  } catch (err) {
    return handleError(res, err);
    // res.status(400).json({ error: (err as Error).message });
  }
}

function handleError(res: Response, err: unknown) {
  if (err instanceof Error) {
    switch (err.message) {
      case "AUTH_INVALID_CREDENTIALS":
        return res.status(401).json({ pome_code: "invalid_credentials" });

      case "RESET_TOKEN_INVALID":
        return res.status(403).json({ pome_code: "invalid_reset_token" });

      default:
        return res.status(400).json({ pome_code: "bad_request" });
    }
  }

  return res.status(500).json({ pome_code: "server_error" });
}

