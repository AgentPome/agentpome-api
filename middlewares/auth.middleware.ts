import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            pome_code: "UNAUTHORIZED"
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
        };

        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch {
        return res.status(401).json({
            pome_code: "INVALID_TOKEN"
        })
    }
}