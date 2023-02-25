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

import { studentAction } from '@/store/index';

import { Student } from '@/types/schema.types';
import { showNotification, cleanNotifications } from '@mantine/notifications';

type TableRowType = {
  student: Student;
  toggleDrawer: Dispatch<React.SetStateAction<boolean>>;
  copyProfile: (user: Student) => void;
  deleteProfile: (user: Student) => void;
  mobileScreen: boolean;
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

const TableRow = ({ student, toggleDrawer, copyProfile, deleteProfile, mobileScreen }: TableRowType) => {
  const { classes } = useStyles();
  const dispatch = useStoreDispatch();

  const handleSendEmail = async () => {
    showNotification({
      title: 'Sending mail',
      message: "Please wait...",
      color: 'green',
      loading: true,
    });

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: student.email,
        id: student.id
      })
    });

    const { status, message } = await res.json();
    cleanNotifications()

    if(status === 250) {
      showNotification({
        title: 'Mail sent',
        message: message,
        color: 'teal',
      });
      dispatch(studentAction.updateStudentStatus({ id: student.id, status: "sent"}));
    }else {
      showNotification({
        title: 'Error',
        message: message,
        color: 'red',
        icon: '🚨',
      });
    }
  }

  return (
    <tr key={student.id}>
      <td>{student.firstName}</td>
      {!mobileScreen && <td>{student.lastName}</td>}
      {!mobileScreen && <td>{student.email}</td>}
      <td>
        <Badge color={student.status === 'idle' ? 'yellow' : 'blue'}>{student.status}</Badge>
      </td>
      <td>
        <Menu classNames={classes}>
          <Menu.Target>
            <IconDots size={16} style={{ cursor: 'pointer' }} />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{`${student.firstName} ${student.lastName}`}</Menu.Label>
            <Menu.Item
              icon={<IconMailForward size={14}/>}
              onClick={handleSendEmail}
            >
              Send Email
            </Menu.Item>
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
            <Menu.Item icon={<IconDeviceFloppy size={14} />} onClick={() => copyProfile(student)}>
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
    </tr>
  );
};

export default TableRow;
