import { Table, Text, Skeleton } from '@mantine/core';

import { useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store/index';
import TableRow from './table-row';


export default function RecentActivityTable(/*props*/) {
  const { populateStudents, loading } = useStoreSelector(studentState);

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
      {populateStudents.length > 0 ? (
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
              <TableRow students={populateStudents} />
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

