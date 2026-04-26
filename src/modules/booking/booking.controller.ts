import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { BookingStatus } from "../../../generated/prisma/enums";

// ✅ CREATE
const createBooking = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("Unauthorized");
    }

    const result = await BookingServices.createBooking(studentId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET SINGLE
const getBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingServices.getBooking(req.params.id as string);

    if (!result) {
      throw new Error("Booking not found");
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
    });
  }
};

const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new Error("Unauthorized");
    }

    const result = await BookingServices.getUserBookings(userId, role);

    res.send({
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    const { bookingId } = req.params;
    const { status } = req.body;
    console.log({
      userId,
      role,
      bookingId,
      status,
    });

    if (!userId || !role) {
      throw new Error("Unauthorized");
    }

    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    if (!status) {
      throw new Error("Status is required");
    }

    // Optional: validate enum manually (extra safety)
    const validStatuses = Object.values(BookingStatus);

    if (!validStatuses.includes(status)) {
      throw new Error("Invalid booking status");
    }

    const result = await BookingServices.updateBookingStatus(
      bookingId as string,
      status,
      userId,
      role,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking status updated successfully",
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: error.statusCode || 400,
      success: false,
      message: error.message,
    });
  }
};

export const BookingControllers = {
  createBooking,
  getBooking,
  getUserBookings,
  updateBookingStatus,
};
