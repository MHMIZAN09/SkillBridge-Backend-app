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

router.get("/:id", TutorControllers.getTutorById);

export const tutorRoutes = router;
