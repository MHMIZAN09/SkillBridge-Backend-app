import { Booking } from "../../../generated/prisma/client";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
const createBooking = async (studentId: string, data: any) => {
  console.log("📦 DATA:", data);
  console.log("👤 STUDENT:", studentId);

  const { tutorProfileId, sessionDate, startTime, endTime, totalPrice } = data;

  const booking = await prisma.booking.create({
    data: {
      studentId, // ✅ MUST be string
      tutorProfileId,
      sessionDate: new Date(sessionDate),
      startTime: new Date(`1970-01-01T${startTime}:00Z`),
      endTime: new Date(`1970-01-01T${endTime}:00Z`),
      totalPrice: Number(totalPrice),
      status: "PENDING",
    },
  });

  return booking;
};

const getBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutorProfile: true,
      student: true,
    },
  });

  return booking;
};
export const BookingServices = {
  createBooking,
  getBooking,
};
