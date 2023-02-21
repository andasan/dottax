import AddStudentPage from '@/screens/add-student/add-student-page';
import prisma from '@/lib/prisma';

export default async function AddStudent() {

  const students = await prisma.student.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      studentId: true,
      status: true,
      batch: true,
    },
  });

  return <AddStudentPage data={students} />
}