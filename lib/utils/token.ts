import jwt from "jsonwebtoken";
import config from "../../config/config";

export const generateAccessToken = (userId: string) => {
  // Question: Should we include more user information in the token payload?
  // Answer: This is sufficient, we can add if we need to check any other user
  // info for token generation, for example like permission
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: "1h" });
};

export const generateRefreshToken = (userId: string) => {
  // Question: Should we include more user information in the refresh token payload?
  // Refresh Token - unique identifier like user ID.
  // Answer: No, The minimal info is sufficient to map the token
  return jwt.sign({ id: userId }, config.refreshTokenSecret, { expiresIn: "7d" });
};