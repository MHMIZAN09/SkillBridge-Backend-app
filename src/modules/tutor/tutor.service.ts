import { prisma } from "../../lib/prisma";

const tutorProfileUpdateService = async (id: string, profileData: any) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: id },
  });
  if (!tutor) {
    throw new Error("Tutor not found");
  }
  const updatedTutor = await prisma.tutorProfile.update({
    where: { userId: id },
    data: profileData,
  });
  return updatedTutor;
};

const getTutorById = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          phone: true,
          address: true,
        },
      },
    },
  });
  if (!tutor) {
    throw new Error("Tutor not found");
  }
  return tutor;
};



export const TutorServices = {
  tutorProfileUpdateService,
  getTutorById,
};
