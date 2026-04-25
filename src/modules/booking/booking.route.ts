import express from "express";
import { BookingControllers } from "./booking.controller";
import { UsersRole } from "../../../generated/prisma/enums";
import authMiddleware from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authMiddleware(UsersRole.STUDENT, UsersRole.ADMIN, UsersRole.TUTOR),
  BookingControllers.createBooking,
);

export const bookingRoutes = router;
