import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../db/client";
import { users } from "../db/schema";
import { generateAccessToken, generateRefreshToken } from "../lib/utils/token";
import { sendResetEmail } from "../lib/utils/email";
import { SignupRequestType, LoginRequestType, AuthResponseType } from "../types/auth.types";
import config from "../config/config";
import { eq } from "drizzle-orm";
import { UserPlan } from "../types/common.types";
 
export const registerUser = async ({ 
  email, password 
}: SignupRequestType): Promise<AuthResponseType> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert user
    const [user] = await db
      .insert(users)
      .values({ 
        email,
        password: hashedPassword,
        plan: UserPlan.FREE
      })
      .returning();

    const token = generateAccessToken({
      id: user.id,
      email: user.email,
    })


    return { 
      token, 
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan as UserPlan,
      }
     };
  } catch (err) {
    throw new Error("USER_ALREADY_EXISTS");
  }
  
};

export const loginUser = async ({ 
  email, password 
}: LoginRequestType): Promise<AuthResponseType> => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) throw new Error("AUTH_INVALID_CREDENTIALS");
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("AUTH_INVALID_CREDENTIALS");

  const token = generateAccessToken({
    id: user.id,
    email: user.email
  })

  return { 
    token, 
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan as UserPlan,
    }
   };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
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
): Promise<void> => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (
    !user ||
    user.resetToken !== token ||
    !user.resetExpiresAt ||
    user.resetExpiresAt < new Date()
  ) {
    throw new Error("RESET_TOKEN_INVALID");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetToken: null,
      resetExpiresAt: null,
    })
    .where(eq(users.email, email));
};
