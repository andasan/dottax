import { Table, Text, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store/index';
import TableRow from './table-row';

export default function RecentActivityTable(/*props*/) {
  const { populateStudents, loading } = useStoreSelector(studentState);

  const [sortedStudents, setSortedStudents] = useState<any>(null);

  useEffect(() => {
    const sortedStudents2 = [...populateStudents]
    setSortedStudents(sortedStudents2.sort(
      (a, b) => {
        if (dayjs(a.updatedAt).isAfter(b.updatedAt)) {
          return -1;
        } else if (dayjs(a.updatedAt).isBefore(b.updatedAt)) {
          return 1;
        } else {
          return 0;
        }
      }
    ).slice(0, 5));
  }, [populateStudents]);


  if(loading) {
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
      {sortedStudents && sortedStudents.length > 0 ? (
          <Table highlightOnHover verticalSpacing="md" fontSize="xs">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>E-mail</th>
                <th>Status</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <TableRow students={sortedStudents} />
            </tbody>
          </Table>
      ) : (
        <Text align="center" weight="bold">
          No students found
        </Text>
      )}
    </>
  );
}

