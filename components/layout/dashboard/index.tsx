'use client';

import { FormEvent, useState, useEffect } from 'react';
import { Box, Flex, Grid, Paper, Stack, Title } from '@mantine/core';

import { StatsGrid } from '@/components/common';
import { SentMailStatsCard } from '@/components/common/cards';
import { useStoreDispatch } from '@/lib/hooks';
import { studentAction } from '@/store/index';
import RecentActivityTable from '@/components/common/table/recent-activity';

import { StudentProps } from '@/types/schema.types';

export default function Dashboard({ students }: StudentProps) {
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(studentAction.loadStudents(students));
    dispatch(studentAction.loadBatches(students));
  }, [students, dispatch]);

  return (
    <div className="grid">
      <div className="flex-[12]">
        <Stack>
          <SentMailStatsCard />
        </Stack>
      </div>
      <div className="flex-[12]">
        <Stack mt="xl">
          <StatsGrid />
        </Stack>
      </div>
      <div className="flex-[12]">
        <Stack mt="xl">
          {/* <Paper p="sm" ml="xl">
            <Title ml="xl">Recent Activity</Title>
          </Paper> */}
          <Flex gap="md" align="center">
            <Title>Recent Activity</Title>
          </Flex>
          <RecentActivityTable />
        </Stack>
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