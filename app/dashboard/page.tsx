import Dashboard from '@/components/layout/dashboard';
import prisma from '@/lib/prisma';

export default async function Home() {
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
  return <Dashboard students={students} />;
}
