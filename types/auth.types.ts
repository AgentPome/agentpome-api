import { UUID, UserPlan } from "./common.types";

export interface SignupRequestType {
    email: string;
    password: string;
}

export interface LoginRequestType {
    email: string;
    password: string;
}

export interface AuthResponseType {
    token: string;
    user: AuthUserType
}

export interface AuthUserType {
    id: UUID;
    email: string;
    plan: UserPlan;
}