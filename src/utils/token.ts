import jwt from "jsonwebtoken";
import { env } from "../index";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.refreshSecret, { expiresIn: "7d" });
};
