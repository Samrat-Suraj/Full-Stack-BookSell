import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import EnvVars from "../config/EnvVars";
import User from "../model/user.model";

// Extend Request type to allow `user`
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.cookies["books"];
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, EnvVars.JWT_SECRET) as JwtPayload;

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token. Authorization failed." });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Access denied." });
        }

        req.user = user;
        next();
    } catch (error: any) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};
