import express from "express";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

router.post(
  "/",

  CategoryController.createCategory,
);

router.put(
  "/:id",

  CategoryController.updateCategory,
);

router.delete(
  "/:id",

  CategoryController.deleteCategory,
);

export const categoryRoutes = router;
