import BatchEmailPage from '@/screens/batch-email';

export default async function BatchEmail({ params }: { params: { batch: number }}) {

  const { batch } = params

  return <BatchEmailPage batch={batch} data-superjson />
}