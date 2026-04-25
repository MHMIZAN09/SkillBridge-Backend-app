import express from "express";
import { TutorControllers } from "./tutor.controller";
import { UsersRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../middlewares/auth";

const router = express.Router();

router.put(
  "/profile",
  authMiddleware(UsersRole.TUTOR),
  TutorControllers.updateTutorProfile,
);
export const tutorRoutes = router;
