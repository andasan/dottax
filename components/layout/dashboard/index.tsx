'use client';

import { Paper, Stack, Title } from '@mantine/core';

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
          <Paper p="sm">
            <Title>Recent Activity</Title>
            <RecentActivityTable />
          </Paper>
        </Stack>
      </div>
    </div>
  );
}