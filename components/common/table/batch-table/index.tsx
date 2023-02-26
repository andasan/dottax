import { Table, Text, Skeleton, ScrollArea, createStyles } from '@mantine/core';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export default function BatchTable({ data }: { data: any }) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const headerRow = data[0];
  const bodyRows = data.slice(1);

  if(data.length === 0) {
    return (
      <>
      <Skeleton height={28} mt={20} radius="sm" />
      <Skeleton height={18} mt={8} radius="sm" />
      <Skeleton height={18} mt={8} radius="sm" />
      <Skeleton height={18} mt={8} radius="sm" />
      <Skeleton height={18} mt={8} radius="sm" />
      <Skeleton height={18} mt={8} radius="sm" />
      <Skeleton height={18} mt={8} radius="sm" />
    </>
    );
  }

  return (
    <>
      {data.length > 0 ? (
        <ScrollArea sx={{ height: 400 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
          <Table highlightOnHover verticalSpacing="md" fontSize="xs" sx={{ height: 500 }}>
            <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
              <tr style={{ position: 'sticky' }}>
                {headerRow.map((item: string, index: number) => (
                  <th key={index}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row: string[], index: number) => (
                <tr key={index}>
                  {row.map((item: string, index: number) => (
                    <td key={index}>{item}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      ) : (
        <Text align="center" weight="bold">
          No students found
        </Text>
      )}
    </>
  );
}
