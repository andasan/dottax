'use client';

import { useState, useEffect } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Paper,
  Grid,
  Title,
  Chip,
  Drawer,
  Skeleton,
  MediaQuery,
  Button,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { useClipboard, useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

import { useStoreSelector, useStoreDispatch } from '@/lib/hooks';
import { studentState, studentAction } from '@/store/index';
import EditUserForm from '@/components/common/forms/edit-user';
import TableRow from './table-row';

import { Student } from '@/types/schema.types';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
  hide?: boolean;
}

function Th({ children, reversed, sorted, onSort, hide }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;

  if (hide) {
    return null;
  }

  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: Student[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
  );
}

function sortData(
  data: Student[],
  payload: { sortBy: keyof Student | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }

      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search
  );
}

export default function MailingListTable({ batch }: { batch: number }) {
  const { studentsByBatch, loading } = useStoreSelector(studentState);
  const dispatch = useStoreDispatch();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState([] as Student[]);
  const [sortBy, setSortBy] = useState<keyof Student | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [emailMode, setEmailMode] = useState('all');
  const [drawerOpened, toggleDrawer] = useState(false);

  const clipboard = useClipboard();
  const modals = useModals();

  const mobileScreen = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    dispatch(studentAction.loadStudentsByBatch(batch));
  }, [batch]);

  useEffect(() => {
    setSortedData(studentsByBatch);
  }, [studentsByBatch]);

  const setSorting = (field: keyof Student) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(studentsByBatch, { sortBy: field, reversed, search }));
  };

  const handleEmailMode = (value: string) => {
    switch (value) {
      case 'sent':
      case 'pending':
        setSortedData(
          studentsByBatch.filter(
            (item: Student) => item.status.toLowerCase() === value.toLowerCase()
          )
        );
        break;
      default:
        setSortedData(studentsByBatch);
        break;
    }

    setEmailMode(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(studentsByBatch, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const onSubmitEditForm = async (student: any) => {
    toggleDrawer(false);

    // Edit data in db
    const res = await fetch('/api/update-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student }),
    });

    // In case we need to return data from the server
    // const data = await res.json();

    if (!res.ok) {
      showNotification({
        title: 'Something went wrong!',
        message: `Unable to edit ${student.firstName}'s profile`,
        color: 'red',
      });
    } else {
      showNotification({
        title: 'Edit profile',
        message: `You have successfully edited ${student.firstName}'s profile`,
        color: 'teal',
      });
    }
  };

  const copyProfile = (user: Student) => {
    clipboard.copy(JSON.stringify(user));

    showNotification({
      title: 'Copy profile',
      message: `${user.firstName}'s profile has been successfully saved to the clipboard in JSON format`,
      color: 'teal',
    });
  };

  const deleteProfile = (student: Student) => {
    modals.openConfirmModal({
      title: 'Delete profile',
      children: (
        <Text size="sm" lineClamp={2}>
          Are you sure you want to delete <b>{student.firstName}</b>'s profile?
          <br />
          This action cannot be undone!
        </Text>
      ),
      centered: true,
      labels: { confirm: 'Ok', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => onDeleteProfile(student),
    });
  };

  const onDeleteProfile = async (student: Student) => {
    // remove data in db
    const res = await fetch('/api/delete-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: student.id }),
    });

    dispatch(studentAction.deleteStudent(student.id));

    if (!res.ok) {
      showNotification({
        title: 'Something went wrong!',
        message: `Unable to delete ${student.firstName}'s profile`,
        color: 'red',
      });
    } else {
      showNotification({
        title: 'Delete Profile',
        message: `You have successfully deleted ${student.firstName}'s profile`,
        color: 'teal',
      });
    }
  };

  const handleSendBulkEmail = async () => {
    router.push(`/batch-email/${batch}`);
  };

  const rows = sortedData.map((row) => (
    <TableRow
      key={row.id}
      student={row}
      toggleDrawer={toggleDrawer}
      copyProfile={copyProfile}
      deleteProfile={deleteProfile}
      mobileScreen={mobileScreen}
    />
  ));

  if (loading) {
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
    <Paper p="sm">
      <ScrollArea>
        <Drawer
          opened={drawerOpened}
          onClose={() => toggleDrawer(false)}
          title="Modify Student Profile"
          padding="xl"
          size="xl"
        >
          <EditUserForm submitForm={onSubmitEditForm} />
        </Drawer>

        <Grid align="baseline" justify={'center'}>
          <Grid.Col sm={12} md={3} lg={3}>
            <Title order={2}>Batch {batch}</Title>
          </Grid.Col>
          <Grid.Col sm={12} md={5} lg={5} style={{justifyContent: "center"}}>
            <Center>
              <Button compact onClick={handleSendBulkEmail}>Send Email to all</Button>
            </Center>
          </Grid.Col>
          <Grid.Col sm={12} md={4} lg={4}>
            <Chip.Group value={emailMode} onChange={handleEmailMode} spacing="sm" mb="lg" style={{justifyContent: "flex-end"}}>
              <Chip value="pending">Pending</Chip>
              <Chip value="sent">Sent</Chip>
              <Chip value="all">All</Chip>
            </Chip.Group>
          </Grid.Col>
        </Grid>

        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          highlightOnHover
          fontSize="xs"
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === 'firstName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('firstName')}
              >
                First Name
              </Th>
              <Th
                sorted={sortBy === 'lastName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('lastName')}
                hide={mobileScreen}
              >
                Last Name
              </Th>
              <Th
                sorted={sortBy === 'email'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('email')}
                hide={mobileScreen}
              >
                Email
              </Th>
              <Th
                sorted={sortBy === 'studentId'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('studentId')}
              >
                Student ID
              </Th>
              <Th
                sorted={sortBy === 'status'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('status')}
              >
                Status
              </Th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={6}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}