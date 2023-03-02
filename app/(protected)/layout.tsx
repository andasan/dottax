/* eslint-disable @next/next/no-head-element */
import dayjs from 'dayjs';
import {
  NotificationRegistry,
  QueryClientRegistry,
  ReduxRegistry,
  ModalRegistry,
} from '@/providers';
import Layout from '@/components/layout';

import { getStudents } from '@/lib/prisma';

import '@/styles/globals.css';
import { config } from '@/lib/config';

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const events = await getData();
  console.log("EVENTS: ", events.length)
  const students = await getStudents();

  const data = students.length > 0 ? students.map((student) => {
    const bounce = events.find((event: any) => event.email === student.email);
    if (bounce) {
      return {
        ...student,
        status: "bounced",
        bouncedReason: bounce.reason as string,
        updatedAt: dayjs(student.updatedAt).format("DD/MM/YYYY HH:mm")
      };
    }
    return { ...student, updatedAt: dayjs(student.updatedAt).format("DD/MM/YYYY HH:mm") }
  }) : []

  return (
    <NotificationRegistry>
      <QueryClientRegistry>
        <ModalRegistry>
          <Layout students={data} >{children}</Layout>
        </ModalRegistry>
      </QueryClientRegistry>
    </NotificationRegistry>
  );
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

  return response.json().then(({ body: { events } }) => events.filter((event: any) => event.from === config.email.from));
}

