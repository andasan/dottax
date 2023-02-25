/* eslint-disable @next/next/no-head-element */
import {
  NotificationRegistry,
  QueryClientRegistry,
  ReduxRegistry,
  ModalRegistry,
} from '@/providers';
import Layout from '@/components/layout';

import prisma from '@/lib/prisma';

import '@/styles/globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const students = await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      studentId: true,
      status: true,
      batch: true,
      updatedAt: true,
    },
  });

  return (
    <NotificationRegistry>
      <ReduxRegistry>
        <QueryClientRegistry>
          <ModalRegistry>
            <Layout students={students}>{children}</Layout>
            </ModalRegistry>
        </QueryClientRegistry>
      </ReduxRegistry>
    </NotificationRegistry>
  );
}
