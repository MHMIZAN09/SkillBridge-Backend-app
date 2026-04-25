import { UsersStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsersService = async () => {
  const users = await prisma.users.findMany({
    include: {
      tutorProfile: true,
    },
  });

  return users;
};

const updateUsersStatusService = async (id: string, status: UsersStatus) => {
  const user = await prisma.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.users.update({
    where: { id },
    data: { status },
  });

  return updatedUser;
};

export const adminServices = {
  getAllUsersService,
  updateUsersStatusService,
};
