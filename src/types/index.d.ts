import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
