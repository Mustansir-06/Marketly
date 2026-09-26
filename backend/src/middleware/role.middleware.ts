import { NextFunction, Request, Response } from "express"
export const authorizeRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!roles.includes(req.user!.role)) {
                return res.status(403).json({ message: "You do not have permission to perform this action" });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: "you are not allowed to access this" });
        }
    };
};