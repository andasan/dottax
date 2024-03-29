import AddBatchPage from '@/screens/add-batch';
import prisma from '@/lib/prisma';

export default async function AddBatch() {

  const students = await prisma.studentproto.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      studentId: true,
      status: true,
      batch: true,
    },
  });

  return <AddBatchPage />
}