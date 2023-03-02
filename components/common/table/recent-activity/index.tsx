import { Table, Text, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat)

import TableRow from './table-row';
import { useStudentStore } from '@/lib/zustand';

export default function RecentActivityTable(/*props*/) {
  const students = useStudentStore(state => state.students);
  const loading = useStudentStore(state => state.loading);

  const [sortedStudents, setSortedStudents] = useState<any>(null);

  useEffect(() => {
    setSortedStudents(students.sort(
      (a, b) => {
        const aDate = dayjs(a.updatedAt, "DD/MM/YYYY HH:mm");
        const bDate = dayjs(b.updatedAt, "DD/MM/YYYY HH:mm");
        if (aDate.isAfter(bDate)) {
          return -1;
        } else if (aDate.isBefore(bDate)) {
          return 1;
        } else {
          return 0;
        }
      }
    ).slice(0, 5));
  }, [students]);


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

