import { Router } from "express";
import {
  register,
  login,
  resetPasswordRequest,
  resetPassword,
  getdetails,
  refresh,
  changePassword,
  verifyTokenn,
} from "../controllers/auth.controllers";
import { verifyToken , requireRefreshHeaders } from "../middleware/auth.middleware";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password", resetPassword);
router.post("/me", verifyToken, getdetails);
router.post("/refresh",requireRefreshHeaders,refresh);
router.post("/change-password", verifyToken, changePassword);
router.post("/verify-token", verifyTokenn);

export default router;
