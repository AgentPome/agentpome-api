import jwt from "jsonwebtoken";
import config from "../../config/config";

export const generateAccessToken = (userId: string) => {
  // Question: Should we include more user information in the token payload?
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string) => {
  // Question: Should we include more user information in the refresh token payload?
  return jwt.sign({ id: userId }, config.refreshTokenSecret, { expiresIn: "7d" });
};