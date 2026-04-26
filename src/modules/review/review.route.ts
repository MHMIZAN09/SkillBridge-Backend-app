import express from "express";
import auth from "../../middlewares/auth";
import { UsersRole } from "../../../generated/prisma/enums";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
  "/",
  auth(UsersRole.STUDENT, UsersRole.ADMIN, UsersRole.TUTOR),
  ReviewController.createReview,
);

router.get(
  "/",
  auth(UsersRole.STUDENT, UsersRole.ADMIN, UsersRole.TUTOR),
  ReviewController.getAllReviews,
);

router.get(
  "/:reviewId",
  auth(UsersRole.STUDENT, UsersRole.ADMIN, UsersRole.TUTOR),
  ReviewController.getReviewById,
);

export const reviewRoutes = router;
