import { Booking, Prisma } from "../../../generated/prisma/client";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBooking = async (studentId: string, data: any) => {
  const { tutorProfileId, sessionDate, startTime, endTime, totalPrice } = data;

  const user = await prisma.users.findUnique({
    where: { id: studentId },
  });

  if (user?.role === "TUTOR") {
    throw new Error("Tutors cannot book their own sessions");
  }

  if (!startTime || !endTime) {
    throw new Error("Start time and end time are required");
  }

  const parsedStartTime = new Date(`1970-01-01T${startTime}:00Z`);
  const parsedEndTime = new Date(`1970-01-01T${endTime}:00Z`);

  if (isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
    throw new Error("Invalid time format. Use HH:mm");
  }

  if (parsedEndTime <= parsedStartTime) {
    throw new Error("End time must be after start time");
  }

  const sessionDateObj = new Date(sessionDate);

  const conflict = await prisma.booking.findFirst({
    where: {
      tutorProfileId,
      sessionDate: sessionDateObj,
      AND: [
        {
          startTime: { lt: parsedEndTime },
        },
        {
          endTime: { gt: parsedStartTime },
        },
      ],
    },
  });

  if (conflict) {
    throw new Error("This time slot is already booked");
  }

  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      sessionDate: sessionDateObj,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      totalPrice: Number(totalPrice),
      status: BookingStatus.PENDING,
    },
  });

  return booking;
};

const getBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: true,
      tutorProfile: {
        include: {
          user: true,
          category: true,
        },
      },
    },
  });

  return booking;
};

const getUserBookings = async (userId: string, role: string) => {
  const normalizedRole = role?.toLowerCase();

  let whereClause: Prisma.BookingWhereInput = {};

  // STUDENT
  if (normalizedRole === "student") {
    whereClause.studentId = userId;
  }

  // TUTOR (FIXED)
  if (normalizedRole === "tutor") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    whereClause.tutorProfileId = tutorProfile?.id as string;
  }

  // ADMIN
  if (normalizedRole === "admin") {
    whereClause = {};
  }

  return prisma.booking.findMany({
    where: whereClause,
    include: {
      student: true,
      tutorProfile: true,
    },
    orderBy: {
      sessionDate: "desc",
    },
  });
};

const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  userId: string,
  role: string,
): Promise<Booking> => {
  const normalizedRole = role?.toLowerCase();

  return prisma.$transaction(async (tx) => {
    // GET BOOKING
    const existingBooking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutorProfile: true,
      },
    });

    if (!existingBooking) {
      throw new Error("Booking not found");
    }

    // =========================
    // STUDENT RULES
    // =========================
    if (normalizedRole === "STUDENT") {
      if (status !== "CANCELLED") {
        throw new Error("Students can only cancel bookings");
      }

      if (existingBooking.status !== "PENDING") {
        throw new Error("Only pending bookings can be cancelled");
      }

      if (existingBooking.studentId !== userId) {
        throw new Error("Forbidden");
      }
    }

    // =========================
    // TUTOR RULES
    // =========================
    if (normalizedRole === "TUTOR") {
      const tutorProfile = await tx.tutorProfile.findUnique({
        where: { userId },
      });

      if (!tutorProfile || tutorProfile.id !== existingBooking.tutorProfileId) {
        throw new Error("Forbidden: Not your booking");
      }

      if (existingBooking.status === "COMPLETED" && status === "CANCELLED") {
        throw new Error("Cannot cancel completed booking");
      }
    }

    // =========================
    // UPDATE STATUS
    // =========================
    const booking = await tx.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // =========================
    // UPDATE STATS
    // =========================
    if (status === "COMPLETED") {
      const durationMs =
        new Date(booking.endTime).getTime() -
        new Date(booking.startTime).getTime();

      const durationMins = Math.floor(durationMs / (1000 * 60));

      await tx.tutorProfile.update({
        where: { id: booking.tutorProfileId },
        data: {
          totalSessions: { increment: 1 },
          totalMentoringMins: { increment: durationMins },
        },
      });
    }

    return booking;
  });
};

export const BookingServices = {
  createBooking,
  getBooking,
  getUserBookings,
  updateBookingStatus,
};
