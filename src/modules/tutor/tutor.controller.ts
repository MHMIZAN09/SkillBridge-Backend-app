import console from "node:console";
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

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tutor = await TutorServices.getTutorById(id as string);
    console.log("Received request to get tutor by ID:", id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tutor found successfully",
      data: tutor,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || "Failed to fetch tutor information",
    });
  }
};

export const TutorControllers = {
  updateTutorProfile,
  getTutorById,
};
