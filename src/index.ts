import dotenv from "dotenv";
import app from "./app";

dotenv.config();


export const env = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET as string,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET as string, // only if you have it
  resetTokenExpiry: Number(process.env.RESET_TOKEN_EXPIRY_MINUTES) || 30
};

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`);
});
