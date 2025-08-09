import { Router } from "express";
import {
  register,
  login,
  resetPasswordRequest,
  resetPassword,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password", resetPassword);

export default router;
