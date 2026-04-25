import { Request, Response } from "express";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthServices.createUserService(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to create user",
      data: null,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthServices.loginUserService(req.body);
    res.cookie("token", user.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict",
    });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to login user",
      data: null,
    });
  }
};

const currentUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthServices.currentUserService(req.user!.id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Current user fetched successfully",
      data: user,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch current user",
      data: null,
    });
  }
};

export const AuthControllers = {
  createUser,
  loginUser,
  currentUser,
};
