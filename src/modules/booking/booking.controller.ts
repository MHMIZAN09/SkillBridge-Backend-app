import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { BookingServices } from "./booking.service";

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
    console.log("🔥 ERROR:", error);

    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

export const BookingControllers = {
  createBooking,
};
