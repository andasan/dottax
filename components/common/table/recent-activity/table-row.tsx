import { type Dispatch } from 'react';
import { createStyles, Badge, Menu, Divider } from '@mantine/core';
import { useStoreDispatch } from '@/lib/hooks';
import {
  IconDeviceFloppy,
  IconEdit,
  IconMailForward,
  IconBackspace,
  IconDots,
} from '@tabler/icons-react';

import { studentAction } from "@/store/index";

import { Student } from '@/types/schema.types';

type TableRowType = {
  students: Student[];
  toggleDrawer: Dispatch<React.SetStateAction<boolean>>;
  copyProfile: (user: Student) => void;
  deleteProfile: (user: Student) => void;
  hideDetails: boolean;
};

const useStyles = createStyles((theme) => ({
  item: {
    '&[data-hovered]': {
      backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
      color: theme.white,
    },
  },
  icon: {
    cursor: 'pointer',
  },
}));

const TableRow = ({
  students,
  toggleDrawer,
  copyProfile,
  deleteProfile,
  hideDetails = false,
}: TableRowType) => {
  const { classes } = useStyles();
  const dispatch = useStoreDispatch();

  return (
    <>
      {students.slice(0, 5).map((student) => (
        <tr key={student.id}>
          <td>{student.firstName}</td>
          <td>{student.lastName}</td>
          <td>{student.email}</td>
          <td>{student.studentId}</td>
          <td>
            <Badge color={student.status === 'idle' ? 'yellow' : 'blue'}>{student.status}</Badge>
          </td>
          {!hideDetails && (
            <td>
              <Menu classNames={classes}>
                <Menu.Target>
                  <IconDots size={16} />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>{`${student.firstName} ${student.lastName}`}</Menu.Label>
                  <Menu.Item icon={<IconMailForward size={14} />}>Send Email</Menu.Item>
                  <Menu.Item
                    icon={<IconEdit size={14} />}
                    onClick={() => {
                      dispatch(studentAction.selectedProfileData(student));
                      toggleDrawer(true);
                    }}
                  >
                    Edit Profile
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    icon={<IconDeviceFloppy size={14} />}
                    onClick={() => copyProfile(student)}
                  >
                    Copy Profile
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconBackspace size={14} />}
                    onClick={() => deleteProfile(student)}
                    color="red"
                  >
                    Delete Profile
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

export default TableRow;
