import { Table, Text, Skeleton, ScrollArea } from '@mantine/core';

import { Student } from '@/types/schema.types';

export default function BatchTable({ data }: { data: any }) {

  if (!data && data?.length === 0) {
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
      {data?.length > 0 ? (
        <ScrollArea style={{ height: 400, marginTop: 10 }}>
          <Table highlightOnHover verticalSpacing="md" fontSize="xs" >
            <thead>
              <tr style={{ position: 'sticky' }}>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Student ID</th>
              </tr>
            </thead>
            <tbody>
              {data.map((student: Student) => (
                <tr key={student.id}>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.studentId}</td>
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
