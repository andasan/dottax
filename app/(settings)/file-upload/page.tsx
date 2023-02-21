import FileUploadPage from '@/screens/file-upload';
import prisma from '@/lib/prisma';

export default async function FileUpload() {

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

  return <FileUploadPage data={students} />
}