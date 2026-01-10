import jwt from "jsonwebtoken";
import config from "../../config/config";

export interface AccessTokenPayload {
  id: string;
  email: string;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign({
    id: payload.id,
    email: payload.email
  }, config.jwtSecret, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, config.refreshTokenSecret, { expiresIn: "7d" });
};