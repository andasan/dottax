import { useEffect, useState } from 'react'
import { createStyles, Group, Paper, SimpleGrid, Text } from '@mantine/core'
import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react'
import dayjs from 'dayjs'

import type { StatCardType } from '@/types/component.types'
import { icons } from '@/utils/data'
import { AggregatedReport } from '@/types/api.types'

const useStyles = createStyles((theme) => ({
  root: {},

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1
  },

  diff: {
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center'
  },

  icon: {
    color:
      theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4]
  },

  title: {
    fontWeight: 700,
    textTransform: 'uppercase'
  }
}))

export default function StatsGrid() {
  const [aggregate, setAggregate] = useState<AggregatedReport | null>(null)
  const { classes } = useStyles()

  useEffect(() => {

    if(!aggregate){
      const fetchAggregate = async () => {
        const response = await fetch("/api/email/aggregated-reports");
        const { body } = await response.json();
        setAggregate(body)
      }

      fetchAggregate()
    }
  }, [])

  const statCards:StatCardType[] = [
    {
      diff: 'delivered',
      icon: 'deliver',
      title: 'Delivered',
      value: aggregate?.delivered
    },
    {
      diff: 'opens',
      icon: 'open',
      title: 'Opens',
      value: aggregate?.opens
    },
    {
      diff: 'bounces',
      icon: 'bounce',
      title: 'Bounces',
      value: (aggregate?.softBounces || 0) + (aggregate?.hardBounces || 0)
    }
  ]

  const stats = statCards.map((stat: StatCardType) => {
    const Icon = icons[stat.icon]

    const val = stat.value || 0

    const colorCode = () => stat?.diff === 'bounces' ? val > 0 ? 'red' : 'teal' : (val > 0) ? 'teal' : 'red';

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={colorCode()}
            size="sm"
            weight={500}
            className={classes.diff}
          >
            <span>{stat.diff}</span>
          </Text>
        </Group>

        <Text size="xs" color="dimmed" mt={7}>
          Aggregated from {dayjs().subtract(90, 'day').format('YYYY-MM-DD')} to {dayjs().format('YYYY-MM-DD')}
        </Text>
      </Paper>
    )
  })
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 }
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  )
}
