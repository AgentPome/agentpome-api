import jwt from "jsonwebtoken";
import config from "../../config/config";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.refreshTokenSecret, { expiresIn: "7d" });
};