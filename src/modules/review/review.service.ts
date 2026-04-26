import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createReview = async (studentId: string, data: any): Promise<Review> => {
  const { bookingId, rating, comment } = data;

  if (!bookingId || !rating) {
    throw new Error("bookingId and rating are required");
  }

  // 1. Get booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }
  console.log("studentId:", studentId);
  console.log("booking.studentId:", booking.studentId);

  // 2. Ownership check
  if (booking.studentId !== studentId) {
    throw new Error("You can only review your own booking");
  }

  // 3. Must be completed before review
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review completed sessions");
  }

  // 4. Prevent duplicate review
  if (booking.review) {
    throw new Error("Review already exists");
  }

  // 5. Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const result = await prisma.$transaction(async (tx) => {
    // CREATE REVIEW
    const review = await tx.review.create({
      data: {
        bookingId,
        studentId,
        tutorProfileId: booking.tutorProfileId,
        rating: Number(rating),
        comment: comment || "",
      },
    });

    // GET ALL REVIEWS OF TUTOR
    const reviews = await tx.review.findMany({
      where: { tutorProfileId: booking.tutorProfileId },
      select: { rating: true },
    });

    // CALCULATE AVERAGE
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // UPDATE TUTOR PROFILE
    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        averageRating: Number(averageRating.toFixed(2)),
      },
    });

    return review;
  });

  return result;
};

// GET ALL REVIEWS
const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      student: true,
      tutorProfile: {
        include: {
          user: true,
        },
      },
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const getReviewById = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tutorProfile: true,
      booking: true,
    },
  });

  return review;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewById,
};
