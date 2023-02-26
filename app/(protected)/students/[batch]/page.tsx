import MailingListTable from "@/components/common/table/mailing-list"
import prisma from "@/lib/prisma";

export default async function StudentBatch({ params }: { params: { batch: number } }) {
  const { batch } = params

  //implement a prisma query to get the batch data
  const batchData = Number.isInteger(+batch) ? await prisma.student.findMany({
    where: {
      batch: +batch,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      studentId: true,
      status: true,
      batch: true,
    },
    // take: 10,
  }) : []

  return <MailingListTable batchData={batchData} batch={batch} pageSize={20} />

}

