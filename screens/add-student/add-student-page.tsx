'use client';

import {
  Paper,
  Container,
  Skeleton,
  Center
} from '@mantine/core';

import { useStoreDispatch, useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store/index';

import MultipleStudents from './stepper';

export default function AddStudentPage() {
  const dispatch = useStoreDispatch();

  const { loading, batches } = useStoreSelector(studentState);

  if (loading) {
    return(
      <Paper shadow="xs" p="xl">
      <Container size="md" px="xs" pt={20}>
          <Center><Skeleton height={35} mt={5} radius="sm" /></Center>
          <Center><Skeleton width={200} height={28} mt={100} radius="sm" /></Center>
          <Center><Skeleton width={300} height={35} mt={70} radius="sm" /></Center>
          <Center>
            <Skeleton width={80} height={35} mt={50} mr={10} radius="sm" />
            <Skeleton width={100} height={35} mt={50} radius="sm" />
          </Center>
        </Container>
    </Paper>
    )
  }

  return (
    <Paper shadow="xs" p="xl">
      <Container size="md" px="xs" pt={20}>
        <MultipleStudents batches={batches} />
      </Container>
    </Paper>
  );
}

