import { Request as ExpressRequest } from "express";

export interface AuthRequest extends ExpressRequest {
  accessTokenRaw?: string;
  refreshTokenRaw?: string;
  userId?: string;
}
export interface RegisterType {
    email: string;
    password: string;
}

export interface LoginType {
    email: string;
    password: string;
}


