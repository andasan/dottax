'use client';

import {
  Paper,
  Container,
  Skeleton,
  Center,
  Tabs,
  Title
} from '@mantine/core';

import MultipleStudents from './multiple';
import SingleStudent from './single';
import { IconPhoto, IconMessageCircle } from '@tabler/icons-react';

export default function AddStudentPage({ batch }: { batch: number }) {

  return (
    <Paper shadow="xs" p="xl">
      <Container size="md" py={20}>
        <Title mb={20}>Add Student(s) to batch: {batch} </Title>
        <Tabs orientation="vertical" defaultValue="multiple">
          <Tabs.List>
            <Tabs.Tab value="multiple" icon={<IconPhoto size={14} />}>Multiple Students</Tabs.Tab>
            <Tabs.Tab value="single" icon={<IconMessageCircle size={14} />}>Single Student</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="multiple" pt="xs" px="xl">
            <MultipleStudents batch={batch} />
          </Tabs.Panel>

          <Tabs.Panel value="single" pt="xs" px="xl">
            <SingleStudent batch={batch} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Paper>
  );
}

