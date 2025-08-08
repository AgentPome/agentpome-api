import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../prisma/client";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { env } from "../index";
import { sendResetEmail } from "../utils/email";


export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashedPassword } });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return { user, accessToken, refreshToken };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // Always success to prevent enumeration

  const resetToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + env.resetTokenExpiry * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetExpiresAt: expiresAt }
  });

  await sendResetEmail(email, resetToken);
};

export const resetPassword = async (email: string, token: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.resetToken !== token || !user.resetExpiresAt || user.resetExpiresAt < new Date()) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetExpiresAt: null,
      refreshToken: null // Invalidate sessions
    }
  });
};
