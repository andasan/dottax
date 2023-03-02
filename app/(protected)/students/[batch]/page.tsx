import MailingListTable from "@/components/common/table/mailing-list"
import { config } from "@/lib/config";
import { getStudents } from "@/lib/prisma";
import dayjs from "dayjs";

interface StudentBatchProps {
  params: {
    batch: number
  }
}

export default async function StudentBatch({ params }: StudentBatchProps) {
  const { batch } = params

  const events = await getData() || [];
  const PAGE_SIZE = 20;

  const batchData = Number.isInteger(+batch) ? await getStudents(+batch) : []

  const data = batchData.length > 0 ? batchData.map((student) => {
    const bounce = events.find((event: any) => event.email === student.email);
    if (bounce) {
      return {
        ...student,
        status: "bounced",
        bouncedReason: bounce.reason as string,
        updatedAt: dayjs(student.updatedAt).format("DD/MM/YYYY")
      };
    }
    return { ...student, updatedAt: dayjs(student.updatedAt).format("DD/MM/YYYY") }
  }) : []

  return <MailingListTable data={data} batch={batch} pageSize={PAGE_SIZE} />
}

async function getData() {
  const tempClientUrl = process.env.VERCEL_URL;
  const apiUrl = config.clientUrl || `https://${tempClientUrl}`;
  const response = await fetch(apiUrl + '/api/email/activity', {
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
    console.error('Failed to fetch data')
    return []
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return await response.json().then(({ body: { events } }) => events.filter((event: any) => event.from === config.email.from));
}
