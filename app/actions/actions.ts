'use server';

import { PrismaClient } from '@prisma/client';
import { userSchema, User, UserFormData } from './schemas';

const prisma = new PrismaClient();

export async function searchUsers(query: string): Promise<User[]> {
  console.log('Searching users with query:', query);
  return prisma.user.findMany({
    where: {
      name: {             
        startsWith: query,
        mode: 'insensitive', // Case-insensitive search
      },
    },
  });
}

export async function addUser(data: UserFormData): Promise<User> {
  const validatedData = userSchema.omit({ id: true }).parse(data);

  const newUser = await prisma.user.create({
    data: validatedData,
  });

  return newUser;
}

export async function editUser(id: string, data: Partial<UserFormData>): Promise<User> {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new Error('User not found');
  }

  const updatedData = { ...existingUser, ...data };
  const validatedUser = userSchema.parse(updatedData);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: validatedUser,
  });

  return updatedUser;
}

export async function deleteUser(id: string): Promise<void> {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new Error('User not found');
  }

  await prisma.user.delete({ where: { id } });
}
