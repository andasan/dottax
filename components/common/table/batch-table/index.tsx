import { useState } from 'react';
import { Table, Text, Skeleton, ScrollArea } from '@mantine/core';

export default function BatchTable({ data }: { data: any }) {
  console.log(data);

  const headerRow = data[0];
  const bodyRows = data.slice(1);

  return (
    <>
      {data.length > 0 ? (
        <ScrollArea style={{ height: 400 }}>
          <Table highlightOnHover verticalSpacing="md" fontSize="xs" sx={{ height: 500 }}>
            <thead>
              <tr style={{ position: 'sticky' }}>
                {headerRow.map((item: string, index: number) => (
                  <th key={index}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row: string[]) => (
                <tr>
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
