import MailingListTable from "@/components/common/table/mailing-list"
import prisma from '@/lib/prisma';

export default async function StudentBatch({ params }: { params: any}) {
  const { batchNumber } = params

  //convert batchNumber to integer
  const parseBatchNumber = parseInt(batchNumber)

  const students = await prisma.student.findMany({
    where: {
      batch: parseBatchNumber
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

  return <MailingListTable data={students} batchNumber={batchNumber} studentsBatchOnly={studentsBatchOnly} />

}

