import AddStudentPage from '@/screens/add-student/add-student-page';

export default async function AddStudent({ params }: { params: { batch: number }}) {

  const { batch } = params

  return <AddStudentPage batch={batch} />

}