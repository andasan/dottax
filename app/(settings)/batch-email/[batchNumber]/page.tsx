import BatchEmailPage from '@/screens/batch-email';
import prisma from '@/lib/prisma';

export default async function BatchEmail({ params }: { params: any}) {

  const { batchNumber } = params

  const students = await prisma.student.findMany({
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

  return <BatchEmailPage data={students} batchNumber={batchNumber} />
}