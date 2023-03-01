import MailingListTable from "@/components/common/table/mailing-list"
import { config } from "@/lib/config";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

interface StudentBatchProps {
  params: {
    batch: number
  }
}

export default async function StudentBatch({ params }: StudentBatchProps) {
  const { batch } = params

  const events = await getData();
  const PAGE_SIZE = 20;

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
      updatedAt: true,
    },
    // take: 10,
  }) : []

  const data = batchData.map((student) => {
    const bounce = events.find((event: any) => event.email === student.email);
    if (bounce) {
      return {
        ...student,
        status: "bounced",
        bouncedReason: bounce.reason as string,
        updatedAt: dayjs(student.updatedAt).format("DD/MM/YYYY")
      };
    }
    return {...student, updatedAt: dayjs(student.updatedAt).format("DD/MM/YYYY")}
  });

  return <MailingListTable data={data} batch={batch} pageSize={PAGE_SIZE} />
}

async function getData() {
  const response = await fetch(`${config.clientUrl}/api/email/activity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event: "bounces" }),
  });

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return response.json().then(({ body: { events }} ) => events.filter((event: any) => event.from === config.email.from));
}
