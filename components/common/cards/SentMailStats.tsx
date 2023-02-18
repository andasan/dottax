import { useState, useEffect } from 'react';
import { Box, createStyles, Group, Paper, Progress, SimpleGrid, Text } from '@mantine/core';
import { IconArrowUpRight, IconDeviceAnalytics } from '@tabler/icons-react';

import { useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store/index';

const useStyles = createStyles((theme) => ({
  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: '3px solid',
    paddingBottom: 5,
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  diff: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },
}));

export default function SentMailStats() {
  const [emailState, setEmailState] = useState({
    sent: 0,
    total: 0,
    average: 0,
  });
  const { populateStudents } = useStoreSelector(studentState);

  const { classes } = useStyles();

  useEffect(() => {
    const sent = populateStudents.filter((student) => student.status === 'sent').length;
    const total = populateStudents.length;
    setEmailState({
      sent,
      total,
      average: parseInt(((sent / total) * 100).toFixed(0))
    });
  }, [populateStudents]);

  const averageSent = parseInt((emailState.sent/emailState.total * 100).toFixed(2))

  const segments = [{
    color: '#47D6AB',
    label: averageSent > 10 ? `${emailState.sent} Sent` : undefined,
    value: averageSent
  },
  {
    color: '#333',
    label: (100-averageSent) > 10 ? `${emailState.total-emailState.sent} Remaining` : undefined,
    value: 100 - averageSent
  }]

  // const descriptions = data.map((stat) => (
  //   <Box key={stat.label} sx={{ borderBottomColor: stat.color }} className={classes.stat}>
  //     <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
  //       {stat.label}
  //     </Text>

  //     <Group position="apart" align="flex-end" spacing={0}>
  //       <Text weight={700}>{stat.count}</Text>
  //       <Text color={stat.color} weight={700} size="sm" className={classes.statCount}>
  //         {stat.part}%
  //       </Text>
  //     </Group>
  //   </Box>
  // ));

  return (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <Group align="flex-end" spacing="xs">
          <Text size="xl" weight={700}>
            Emails Delivered
          </Text>
          <Text color="teal" className={classes.diff} size="sm" weight={700}>
            <span>{emailState.average}%</span>
            <IconArrowUpRight
              size={16}
              style={{ marginBottom: 4 }}
              stroke={1.5}
            />
          </Text>
        </Group>
        <IconDeviceAnalytics size={20} className={classes.icon} stroke={1.5} />
      </Group>

      <Text color="dimmed" size="sm">
        Emails delivered counter for the current year
      </Text>

      <Progress
        sections={segments}
        size={34}
        classNames={{ label: classes.progressLabel }}
        mt={40}
      />
      {/* <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mt="xl">
        {descriptions}
      </SimpleGrid> */}
    </Paper>
  );
}
