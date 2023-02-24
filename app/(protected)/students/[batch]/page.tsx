import MailingListTable from "@/components/common/table/mailing-list"
import prisma from '@/lib/prisma';

export default async function StudentBatch({ params }: { params: { batch: number } }) {
  const { batch } = params

  const data = await prisma.student.findMany();
  console.log("StudentBatch: ", data.length)


  return <MailingListTable batch={batch} />

}

