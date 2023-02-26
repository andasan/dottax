'use client';

import {
  Paper,
  Container,
  Skeleton,
  Center,
  Tabs,
  Title
} from '@mantine/core';

import { useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store/index';

import MultipleStudents from './stepper';
import SingleStudent from './single';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

export default function AddStudentPage({ batch }: { batch: number }) {
  const { loading, batches } = useStoreSelector(studentState);

  if (loading) {
    return (
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
        <Title mb={20}>Add Student(s) to batch: {batch} </Title>
        <Tabs orientation="vertical" defaultValue="multiple">
          <Tabs.List>
            <Tabs.Tab value="multiple" icon={<IconPhoto size={14} />}>Multiple Students</Tabs.Tab>
            <Tabs.Tab value="single" icon={<IconMessageCircle size={14} />}>Single Student</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="multiple" pt="xs" px="xl">
            <MultipleStudents batches={batches} />
          </Tabs.Panel>

          <Tabs.Panel value="single" pt="xs" px="xl">
            <SingleStudent batch={batch} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Paper>
  );
}

