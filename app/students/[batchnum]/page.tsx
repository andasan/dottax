import MailingListTable from "@/components/common/table/mailing-list"
import prisma from '@/lib/prisma';

export default async function StudentBatch({ params }: { params: { batchnum: number } }) {
  const { batchnum } = params

  const students = await prisma.student.findMany({
    where: {
      batch: +batchnum || 0
    },
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

  const studentsBatchOnly = await prisma.student.findMany({
    select: {
      batch: true,
    },
  });

  return <MailingListTable data={students} batchNumber={batchnum} studentsBatchOnly={studentsBatchOnly} />

}

