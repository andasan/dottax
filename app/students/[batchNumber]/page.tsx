import MailingListTable from "@/components/common/table/mailing-list"
import prisma from '@/lib/prisma';

export default async function StudentBatch({ params }: { params: any}) {
  const { batchNumber } = params

  const students = await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      studentId: true,
      status: true,
    },
  });

  return <MailingListTable data={students} batchNumber={batchNumber} />

}

