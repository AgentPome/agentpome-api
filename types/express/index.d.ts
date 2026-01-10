import { UUID , UserPlan } from "../common.types";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: UUID;
                email: string;
                // plan: UserPlan.FREE | UserPlan.INDIVIDUAL | UserPlan.PRO | UserPlan.PREMIUM;
            };
        }
    }
}

export {};