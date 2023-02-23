'use client';

import { Flex, Stack, Title } from '@mantine/core';

import { StatsGrid } from '@/components/common';
import { SentMailStatsCard } from '@/components/common/cards';
import RecentActivityTable from '@/components/common/table/recent-activity';

export default function Dashboard() {
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