import { prisma } from "../config/prismaClient.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByGoogleId = async (googleId) => {
  return prisma.user.findUnique({ where: { googleId } });
};

export const createUser = async (data) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password ?? null,
      provider: data.provider ?? "local",
      googleId: data.googleId ?? null,
      avatar: data.avatar ?? null,
    },
  });
};

export const updateUser = async (id, update) => {
  return prisma.user.update({
    where: { id },
    data: update,
  });
};
