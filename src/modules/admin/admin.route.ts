import express from "express";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

router.get(
  "/users",
  // authMiddleware(UsersRole.ADMIN),
  AdminControllers.getAllUsers,
);

router.patch("/users/:id", AdminControllers.updateUsersStatus);
export const adminRoutes = router;
