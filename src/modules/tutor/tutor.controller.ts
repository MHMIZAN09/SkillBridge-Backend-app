import sendResponse from "../../utils/sendResponse";
import { TutorServices } from "./tutor.service";
import { Request, Response } from "express";

const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      throw new Error("Unauthorized: user not found in request");
    }

    const id = req.user.id;
    const profileData = req.body;

    // console.log("Received profile update request for tutor ID:", id);
    // console.log("Profile data:", profileData);

    const result = await TutorServices.tutorProfileUpdateService(
      id,
      profileData,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tutor profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || "Failed to update tutor profile",
    });
  }
};

export const TutorControllers = {
  updateTutorProfile,
};
