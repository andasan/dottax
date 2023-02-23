import BatchEmailPage from '@/screens/batch-email';
import prisma from '@/lib/prisma';

export default async function BatchEmail({ params }: { params: { batch: number }}) {

  const { batch } = params

  return <BatchEmailPage batch={batch} />
}