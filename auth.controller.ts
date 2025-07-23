// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { users, User } from '../models/user.model';

export const register = (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ pome_code: 'User already exists' });
  }

  // Add user to memory array
  const newUser: User = { email, password };
  users.push(newUser);

  return res.status(201).json({ pome_code: 'Success', user: newUser });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existing = users.find(u => u.email === email && u.password === password);
  if (!existing) {
    return res.status(401).json({ pome_code : 'Invalid email or password' });
  }

  return res.status(200).json({ pome_code : 'success', user: existing });
};
export const updatePassword = (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const user = users.find(u => u.email === email && u.password === oldPassword);
  if (!user) {
    return res.status(401).json({ pome_code: 'Invalid credentials' });
  }

  user.password = newPassword;
  return res.status(200).json({ pome_code: 'success' });
};

