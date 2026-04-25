import express from "express";
import { AuthControllers } from "./auth.controller";
import authMiddleware from "../../middlewares/auth";
import { UsersRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/register", AuthControllers.createUser);
router.post("/login", AuthControllers.loginUser);
router.get(
  "/me",
  authMiddleware(UsersRole.ADMIN, UsersRole.STUDENT, UsersRole.TUTOR),
  AuthControllers.currentUser,
);

export const authRoutes = router;
