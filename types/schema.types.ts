import { Prisma } from '@prisma/client';

export type Student = Prisma.StudentGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
    email: true;
    studentId: true;
    status: true;
    batch: true;
    updatedAt: true;
  };
}>;
