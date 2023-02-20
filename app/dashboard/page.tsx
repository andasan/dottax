import Dashboard from '@/components/layout/dashboard';
import prisma from '@/lib/prisma';
import { notFound } from "next/navigation";

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

  if(!students){
    notFound();
  }

  return <Dashboard students={students} />;
}
