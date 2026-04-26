import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import sendResponse from "../../utils/sendResponse";
import { UsersStatus } from "../../../generated/prisma/client";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await adminServices.getAllUsersService();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || "Failed to fetch users",
      data: null,
    });
  }
};

const updateUsersStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("Received userId:", id);
    console.log("Received status:", status);

    if (!Object.values(UsersStatus).includes(status)) {
      throw new Error("Invalid status value");
    }
    if (!id) {
      throw new Error("User ID is required");
    }

    const updatedUser = await adminServices.updateUsersStatusService(
      id as string,
      status,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message || "Failed to update user status",
      data: null,
    });
  }
};

const getDashboardStats = async (req: Request, res: Response) => {
  console.log("Received request for dashboard stats");
};


export const AdminControllers = {
  getAllUsers,
  updateUsersStatus,
  getDashboardStats,
};
