'use client';

import { Flex, Stack, Title } from '@mantine/core';

import { StatsGrid } from '@/components/common';
import { SentMailStatsCard } from '@/components/common/cards';
import RecentActivityTable from '@/components/common/table/recent-activity';

import { useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store';

export default function Dashboard() {
  const { batches } = useStoreSelector(studentState);
  console.log("batches", batches)
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
    </div>
  );
}