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

export const TutorServices = {
  tutorProfileUpdateService,
};
