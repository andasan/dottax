import AddStudentPage from '@/screens/add-student';

export default async function AddStudent({ params }: { params: { batch: number }}) {

  const { batch } = params

  return <AddStudentPage batch={batch} />

}