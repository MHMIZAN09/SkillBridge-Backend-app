import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { UsersRole, UsersStatus } from "../../generated/prisma/enums";

const authMiddleware = (...roles: UsersRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const userData = await prisma.users.findUnique({
        where: { email: decoded.email },
      });

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      if (userData.status !== UsersStatus.ACTIVE) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (roles.length && !roles.includes(userData.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default authMiddleware;
