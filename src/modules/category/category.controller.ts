import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.service";

// CREATE
const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await CategoryServices.createCategory(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
const getAllCategories = async (req: Request, res: Response) => {
  const result = await CategoryServices.getAllCategories();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
};

// GET BY ID
const getCategoryById = async (req: Request, res: Response) => {
  const result = await CategoryServices.getCategoryById(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category fetched successfully",
    data: result,
  });
};

// UPDATE
const updateCategory = async (req: Request, res: Response) => {
  const result = await CategoryServices.updateCategory(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
};

// DELETE
const deleteCategory = async (req: Request, res: Response) => {
  const result = await CategoryServices.deleteCategory(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
