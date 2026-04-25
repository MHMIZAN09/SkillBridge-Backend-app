import { prisma } from "../../lib/prisma";

const createCategory = async (data: any) => {
  const category = await prisma.category.create({
    data,
  });
  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      tutorProfiles: true,
    },
  });
  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      tutorProfiles: true,
    },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

const updateCategory = async (id: string, data: any) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const updatedCategory = await prisma.category.update({
    where: { id },
    data,
  });
  return updatedCategory;
};
const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  await prisma.category.delete({
    where: { id },
  });
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
