import MailingListTable from "@/components/common/table/mailing-list"
import prisma from '@/lib/prisma';

export default async function StudentBatch({ params }: { params: { batch: number } }) {
  const { batch } = params

  return <MailingListTable batch={batch} />

}

