import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersRole } from "../../../generated/prisma/enums";

const createUserService = async (payload: any) => {
  const existingUser = await prisma.users.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.users.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    if (user.role === UsersRole.TUTOR) {
      await tx.tutorProfile.create({
        data: {
          userId: user.id,
        },
      });
    }
    return user;
  });
  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const loginUserService = async (payload: any) => {
  const user = await prisma.users.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid password");
  }

  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(userData, process.env.JWT_SECRET!, {
    expiresIn: "10d",
  });

  return { token, userData };
};

const currentUserService = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
export const AuthServices = {
  createUserService,
  loginUserService,
  currentUserService,
};
