import { Badge } from '@mantine/core';

import { Student } from '@/types/schema.types';
import dayjs from 'dayjs';

type TableRowType = {
  students: Student[];
};

const TableRow = ({ students }: TableRowType) => {

  return (
    <>
      {students.slice(0, 5).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() // Sort by most recent
      ).map((student) => (
        <tr key={student.id}>
          <td>{student.firstName}</td>
          <td>{student.lastName}</td>
          <td>{student.email}</td>
          <td>
            <Badge color={student.status === 'idle' ? 'yellow' : 'blue'}>{student.status}</Badge>
          </td>
          <td>{dayjs(student?.updatedAt).format('MMM D, YY : hh:mm A')}</td>
        </tr>
      ))}
    </>
  );
};

export default TableRow;
