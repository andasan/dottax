'use client';

import { FormEvent, useState, useEffect } from 'react';
import { Box, Flex, Grid, Paper, Stack, Title } from '@mantine/core';
import { IconBasket, IconCards } from '@tabler/icons-react';
import { useStoreDispatch, useStoreSelector } from '@/lib/hooks';
import { Prisma } from '@prisma/client';

import { RecentOrdersTable, StatsGrid, TransactionTable } from '@/components/common';
import { SentMailStatsCard, ViewStatBars } from '@/components/common/cards';
import { RevenueChart } from '@/components/common/charts';
import { viewStats } from '@/data/cards';
import { data } from '@/data/revenue';
import { studentAction, studentState } from '@/store/index';

type Student = Prisma.StudentGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    studentId: true;
    status: true;
  };
}>;

type StudentProps = {
  students: Student[];
};

export default function Dashboard({ students }: StudentProps) {
  const { populateStudents, loading } = useStoreSelector(studentState);
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(studentAction.loadStudents(students));
  }, [students, dispatch]);

  return (
    <div className="grid">
      <div className="flex-[12]">
        <Stack>
          <SentMailStatsCard />
        </Stack>
      </div>
      <Stack ml="xl" mt="xl">
        <StatsGrid />
      </Stack>
      <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="flex-[8]">
          <Stack>
            <Paper p="sm" ml="xl">
              <Title ml="xl">Recent Activity</Title>
            </Paper>
            <div className="h-[400px] w-full">{/* <RevenueChart data={data} /> */}</div>
          </Stack>
        </div>
        <div className="flex-[4]">
          <Stack mb="xl">
            <ViewStatBars data={viewStats} />
          </Stack>
        </div>
      </div>
      {/* <Grid>
        <Grid.Col sm={12} md={5} lg={5}>
          <Box aria-label="transactions" title="Transactions">
            <Paper p="xs">
              <Flex gap="md" align="center">
                <Title order={2}>Transaction History</Title>
                <IconCards />
              </Flex>
            </Paper>
            <TransactionTable />
          </Box>
        </Grid.Col>
        <Grid.Col sm={12} md={7} lg={7}>
          <Box h={100}>
            <Paper p="xs">
              <Flex gap="md" align="center">
                <Title order={2}>Recent Orders</Title>
                <IconBasket />
              </Flex>
            </Paper>
            <RecentOrdersTable />
          </Box>
        </Grid.Col>
      </Grid> */}
    </div>
  );
}
