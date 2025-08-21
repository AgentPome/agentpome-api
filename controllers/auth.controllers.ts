import { Request, Response } from "express";
import * as AuthService from "../services/auth.services"; // assuming your service file

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    // Question: Register User returns three values: user, accessToken, refreshToken
    // but we used only accessToken and refreshToken in the response.
    // Is it okay to ignore the user object here?
    // Answer: Yes, We can ignore if we only use this endpoint to issue token 
    // and for authentication.(User object - which has user profile data) 
    const { accessToken, refreshToken } = await AuthService.registerUser({ email, password });

    res.status(201)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Refresh-Token", refreshToken)
      .json({ pome_code: "success" });
  } catch (err) {
    // Question: Can we use 400 status for all errors?
    //Answer: No, 400 is only for client side issues like wrong request, 
    // invalid data or others reasons. While we can have any kind of 
    // errors also from client side , so we have to use appropriate error codes like 500,401, etc.,
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    // Question: Register User returns three values: user, accessToken, refreshToken
    // but we used only accessToken and refreshToken in the response.
    // Is it okay to ignore the user object here?
    // Answer: Yes, We can ignore if we only use this endpoint to issue token 
    // and for authentication.(User object - which has user profile data) 
    const { accessToken, refreshToken } = await AuthService.loginUser({ email, password });
    res.status(200)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Refresh-Token", refreshToken)
      .json({ pome_code: "success" });
  } catch (err) {
    // Question: Can we use 400 status for all errors?
    //Answer: No, 400 is only for client side issues like wrong request, 
    // invalid data or others reasons. While we can have any kind of 
    // errors also from client side , so we have to use appropriate error codes like 500,401, etc.,
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function resetPasswordRequest(req: Request, res: Response) {
  try {
    const { email } = req.body;
    await AuthService.requestPasswordReset(email);
    // Question: Is it okay to not return the status code here?
    // Answer: It is ok.. But using status code will be more helpful, like if we have any
    // kind of errors we can easily debug using error codes
    res.json({ pome_code: "success" });
  } catch (err) {
    // Question: Can we use 400 status for all errors?
    res.status(400).json({ error: (err as Error).message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, "reset-token": token, password } = req.body;
    await AuthService.resetPassword(email, token, password);
    // Question: Is it okay to not return the status code here?
    res.json({ pome_code: "success" });
  } catch (err) {
    // Question: Can we use 400 status for all errors?
    res.status(400).json({ error: (err as Error).message });
  }
}
