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

router.get(
  "/:id",
  authMiddleware(UsersRole.STUDENT, UsersRole.ADMIN, UsersRole.TUTOR),
  BookingControllers.getBooking,
);

router.get(
  "/",
  authMiddleware(UsersRole.STUDENT, UsersRole.ADMIN, UsersRole.TUTOR),
  BookingControllers.getUserBookings,
);

router.patch(
  "/:bookingId/status",
  authMiddleware(UsersRole.STUDENT, UsersRole.ADMIN, UsersRole.TUTOR),
  BookingControllers.updateBookingStatus,
);

export const bookingRoutes = router;
