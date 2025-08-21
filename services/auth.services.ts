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
  // Question: Should we check if the user already exists before inserting?
  // Answer: Yes, we should check , if we skip this step we'll be endup with
  // duplicate entries in the DB which can cause login problems and errors.

  // Question: Input Validation Missing , Vulnerable to SQL Injection?
  // Answer: Yes, Input validation is missing . Here the user can enter anything 
  // they want and the data has been stored directly without any validation/sanitation
  // which can be vulnerable to sql-injection.
  const [user] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    // Question: should we return the user object here?
    // Answer: It is not mandatory bu t we can have that return option by returning the non-sensitive datas like name , email. 

    .returning();

  const accessToken = generateAccessToken(user.id);
  // Bug: Faulty Refresh Token Logic
  const refreshToken = generateRefreshToken(user.id);

  await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id));

  return { user, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }: LoginType) => {
  // Question: does this query select the entire columns in the user table to find the user?
  // Yes, the query will return all the columns , to optimize we can spcify the columns as per our needs
  
  // Question: Input Validation Missing , Vulnerable to SQL Injection
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) throw new Error("Invalid credentials");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user.id);
  // Bug: Faulty Refresh Token Logic
  const refreshToken = generateRefreshToken(user.id);

  await db
    .update(users)
    .set({ refreshToken })
    .where(eq(users.id, user.id));

  return { user, accessToken, refreshToken };
};

export const requestPasswordReset = async (email: string) => {
  // Question: does this query select the entire columns in the user table to find the user?
  // Question: Input Validation Missing , Vulnerable to SQL Injection
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
  // Question: does this query select the entire columns in the user table to find the user?
  // Question: Input Validation Missing , Vulnerable to SQL Injection
  const [user] = await db.select().from(users).where(eq(users.email, email));

  // Question: Check if condition logic is correct ?
  if (
    !user ||
    user.resetToken !== token ||
    !user.resetExpiresAt ||
    user.resetExpiresAt < new Date()
  ) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  // Question: Think about the refresh token logic here.
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
