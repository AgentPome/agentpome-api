import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../db/client";
import { users } from "../db/schema";
import { generateAccessToken, generateRefreshToken } from "../lib/utils/token";
import { sendResetEmail } from "../lib/utils/email";
import { RegisterType, LoginType } from "../types/auth.types";
import config from "../config/config";
import { eq } from "drizzle-orm";

 
export const registerUser = async ({ email, password }: RegisterType) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const [user] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    .returning();

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id));

  return { user, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }: LoginType) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) throw new Error("Invalid credentials");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id));

  return { user, accessToken, refreshToken };
};

export const requestPasswordReset = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return; // Prevent enumeration

  const resetToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + config.resetTokenExpiryMinutes * 60 * 1000);

  await db
    .update(users)
    .set({ resetToken, resetExpiresAt: expiresAt })
    .where(eq(users.email, email));

  await sendResetEmail(email, resetToken);
};

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (
    !user ||
    user.resetToken !== token ||
    !user.resetExpiresAt ||
    user.resetExpiresAt < new Date()
  ) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetToken: null,
      resetExpiresAt: null,
      refreshToken: null,
    })
    .where(eq(users.email, email));
};
