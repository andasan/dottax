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
  Menu,
  Divider,
  Badge,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconTrash, IconDotsVertical, IconPlus, IconSend, IconDots, IconMailForward, IconEdit, IconDeviceFloppy, IconBackspace } from '@tabler/icons-react';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useModals } from '@mantine/modals';
import { useClipboard, useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { DataTable } from 'mantine-datatable';

import { useStoreSelector, useStoreDispatch } from '@/lib/hooks';
import { studentState, studentAction } from '@/store/index';
import EditUserForm from '@/components/common/forms/edit-user';
import TableRow from './table-row';

import { BatchData } from '@/types/component.types';
import { Student } from '@/types/schema.types';
import { fetchDataIfEmpty } from '@/store/thunk';
import { filterData, sortData } from '@/lib/helper';

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
    cursor: 'pointer',
  },

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
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
    },

    item: {
      '&[data-hovered]': {
        backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
        color: theme.white,
      },
    },
    icon: {
      cursor: 'pointer',
    },

  },

  item: {
    '&[data-hovered]': {
      backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
      color: theme.white,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
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

interface MailingListTableProps {
  batchData: BatchData[];
  batch: number;
  pageSize: number;
}


export default function MailingListTable({ batchData, batch, pageSize: PAGE_SIZE }: MailingListTableProps) {
  const { studentsByBatch, loading, students } = useStoreSelector(studentState);
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { classes, cx } = useStyles();

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState([] as Student[]);
  const [sortBy, setSortBy] = useState<keyof Student | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [emailMode, setEmailMode] = useState('all');
  const [drawerOpened, toggleDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const clipboard = useClipboard();
  const modals = useModals();

  const mobileScreen = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    dispatch(studentAction.loadStudentsByBatch(batch));
  }, [batch, students]);

  useEffect(() => {
    if (studentsByBatch.length === 0 && students.length === 0) {
      dispatch(fetchDataIfEmpty(batch));
    }

    setSortedData(studentsByBatch);
  }, [studentsByBatch]);


  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(studentsByBatch.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(studentsByBatch.slice(from, to));
  }, [page]);

  const setSorting = (field: keyof Student) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(studentsByBatch, { sortBy: field, reversed, search }));
  };

  const handleEmailMode = (value: string) => {
    switch (value) {
      case 'sent':
      case 'idle':
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

  const handleAddStudent = async () => {
    router.push(`/add-student/${batch}`);
  };

  const handleRemoveBatch = async () => {
    modals.openConfirmModal({
      title: 'Delete batch',
      children: (
        <Text size="sm" lineClamp={2}>
          Are you sure you want to delete this batch?
          <br />
          This action cannot be undone!
        </Text>
      ),
      centered: true,
      labels: { confirm: 'Ok', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => onDeleteBatch(),
    });
  };

  const onDeleteBatch = async () => {
    // remove data in db
    const res = await fetch('/api/delete-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ batch }),
    });

    if (!res.ok) {
      showNotification({
        title: 'Something went wrong!',
        message: `Unable to delete batch ${batch}`,
        color: 'red',
      });
    } else {
      showNotification({
        title: 'Delete Batch',
        message: `You have successfully deleted batch ${batch}`,
        color: 'teal',
      });
      router.push('/dashboard');

      //update redux to remove batch
      dispatch(studentAction.deleteBatch(batch));
    }
  };

  // const handleSendEmail = async (student: Student) => {
  //   showNotification({
  //     title: 'Sending mail',
  //     message: "Please wait...",
  //     color: 'green',
  //     loading: true,
  //   });

  //   const res = await fetch("/api/send-email", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       email: student.email,
  //       id: student.id
  //     })
  //   });

  //   const { status, message } = await res.json();
  //   cleanNotifications()

  //   if (status === 250) {
  //     showNotification({
  //       title: 'Mail sent',
  //       message: message,
  //       color: 'teal',
  //     });
  //     dispatch(studentAction.updateStudentStatus({ id: student.id, status: "sent" }));
  //   } else {
  //     showNotification({
  //       title: 'Error',
  //       message: message,
  //       color: 'red',
  //       icon: '🚨',
  //     });
  //   }
  // }

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
      <ScrollArea
        sx={{ height: '80vh' }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        scrollHideDelay={0}

      >
        <div style={{ width: '99%' }}>
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
            <Grid.Col sm={12} md={6} lg={6}>
              <Group>
                <Title order={2}>Batch {batch}</Title>
              </Group>
            </Grid.Col>
            <Grid.Col sm={12} md={6} lg={6}>
              <Chip.Group value={emailMode} onChange={handleEmailMode} spacing="sm" mb="lg" style={{ justifyContent: "flex-end" }}>
                <Chip value="idle">Idle</Chip>
                <Chip value="sent">Sent</Chip>
                <Chip value="all">All</Chip>


                <Menu classNames={classes}>
                  <Menu.Target>
                    <IconDotsVertical size={18} style={{ cursor: 'pointer' }} />
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Batch Menu</Menu.Label>
                    <Menu.Item
                      icon={<IconSend size={14} />}
                      onClick={handleSendBulkEmail}
                      color="cyan"
                    >
                      Send Bulk Email
                    </Menu.Item>
                    <Menu.Item
                      icon={<IconPlus size={14} />}
                      onClick={handleAddStudent}
                    >
                      Add Student(s)
                    </Menu.Item>
                    <Divider />
                    <Menu.Item
                      icon={<IconTrash size={14} />}
                      onClick={handleRemoveBatch}
                      color="red"
                    >
                      Delete Batch
                    </Menu.Item>

                  </Menu.Dropdown>
                </Menu>
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
            horizontalSpacing="sm"
            verticalSpacing="xs"
            highlightOnHover
            fontSize="xs"
          >
            <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
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


          {/* <DataTable
            withBorder
            records={records}
            columns={[
              { accessor: 'firstName' },
              { accessor: 'lastName' },
              { accessor: 'email' },
              {
                accessor: 'status',
                title: <Text mr="xs">Status</Text>,
                textAlignment: 'center',
                render: (student) => (
                  <Badge color={student.status === 'idle' ? 'yellow' : 'blue'}>{student.status}</Badge>
                ),
              },
              {
                accessor: 'actions',
                title: <Text mr="xs">Row actions</Text>,
                textAlignment: 'right',
                render: (student: any) => (
                  <Group position='right'>
                  <Menu classNames={classes}>
                    <Menu.Target>
                      <IconDots size={16} style={{ cursor: 'pointer' }} />
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>{`${student.firstName} ${student.lastName}`}</Menu.Label>
                      <Menu.Item
                        icon={<IconMailForward size={14} />}
                        onClick={() => handleSendEmail(student)}
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
                  </Group>
                ),
              },
            ]}
            totalRecords={studentsByBatch.length}
            recordsPerPage={PAGE_SIZE}
            page={page}
            onPageChange={(p) => setPage(p)}
            // uncomment the next line to use a custom loading text
            // loadingText="Loading..."
            // uncomment the next line to display a custom text when no records were found
            // noRecordsText="No records found"
            // uncomment the next line to use a custom pagination text
            // paginationText={({ from, to, totalRecords }) => `Records ${from} - ${to} of ${totalRecords}`}
            // uncomment the next line to use a custom pagination color (see https://mantine.dev/theming/colors/)
            // paginationColor="grape"
            // uncomment the next line to use a custom pagination size
            // paginationSize="md"
            striped
          /> */}
        </div>
      </ScrollArea>
    </Paper>
  );
}