import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      throw new Error("Unauthorized");
    }

    const result = await ReviewService.createReview(studentId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Review created successfully",
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

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await ReviewService.getAllReviews();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All reviews retrieved successfully",
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

const getReviewById = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      throw new Error("Review ID is required");
    }

    const result = await ReviewService.getReviewById(reviewId as string);

    if (!result) {
      throw new Error("Review not found");
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Review retrieved successfully",
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

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewById,
};
