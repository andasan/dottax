'use client';

import { useState, useEffect } from 'react';
import { Paper, Table, Drawer, Text, TextInput, Skeleton, Grid, Title, Chip } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';

import { useStoreSelector, useStoreDispatch } from '@/lib/hooks';
import { studentState, studentAction } from '@/store/index';
import EditUserForm from '@/components/common/forms/edit-user';
import TableRow from './table-row';

import { Student } from '@/types/schema.types';
import type { OrderRowType } from '@/types/component.types'
import { OrderSearch } from '@/components/common/elements';

interface MailingListTableProps {
  source: Student[];
  batchNumber: string;
}

export default function MailingListTable({ source, batchNumber }: MailingListTableProps) {
  const { populateStudents, loading } = useStoreSelector(studentState);
  const dispatch = useStoreDispatch();
  const clipboard = useClipboard();
  const modals = useModals();

  const [students, setStudents] = useState<Student[]>(populateStudents);
  const [drawerOpened, toggleDrawer] = useState(false);

  const [search, setSearch] = useState('')
  const [emailMode, setEmailMode] = useState('all')
  const [filteredData, setFilteredData] = useState(source)
  const [sortBy, setSortBy] = useState<keyof OrderRowType | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  useEffect(() => {
    dispatch(studentAction.loadStudents(source))
  }, [source])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    if (value === '') {
      setFilteredData(source)
    }

    dispatch(studentAction.filterStudents(value));
  }

  const handleEmailMode = (value: string) => {

    switch (value) {
      case 'sent':
      case 'pending':
        setFilteredData(
          source.filter(
            (item: Student) => item.status.toLowerCase() === value.toLowerCase()
          )
        )
        break;
      default:
        setFilteredData(source)
        break;
    }

    setEmailMode(value)
  }

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

  const deleteProfile = (user: Student) => {
    // modals.openConfirmModal({
    //   title: 'Delete profile',
    //   children: (
    //     <Text size="sm" lineClamp={2}>
    //       Are you sure you want to delete <b>{user.firstName}</b>'s profile?
    //       <br />
    //       This action cannot be undone!
    //     </Text>
    //   ),
    //   centered: true,
    //   labels: { confirm: 'Ok', cancel: 'Cancel' },
    //   confirmProps: { color: 'red' },
    //   onConfirm: () => onDeleteProfile(user),
    // });
    modals.openConfirmModal({
      title: 'Delete profile',
      children: (
        <Text size="sm" lineClamp={2}>
          Delete feature is unavailable at the moment.
          <br />
          Reminder for future: This action cannot be undone!
        </Text>
      ),
      centered: true,
      labels: { confirm: 'Ok', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
    });
  };

  const onDeleteProfile = (user: Student) => {
    // remove data in db

    let tmpUsers = students;
    tmpUsers = tmpUsers.filter((u) => u !== user);
    setStudents(tmpUsers);

    showNotification({
      title: 'Delete Profile',
      message: `You have successfully deleted${user.firstName}'s profile`,
      color: 'red',
    });
  };

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
          <Title order={2}>Batch {batchNumber}</Title>
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={6}>
          {/* <OrderSearch /> */}
        </Grid.Col>
        <Grid.Col sm={12} md={3} lg={3}>
          <Chip.Group
            value={emailMode}
            onChange={handleEmailMode}
            spacing="sm"
            mb="lg"
          >
            <Chip value="pending">Pending</Chip>
            <Chip value="sent">Sent</Chip>
            <Chip value="all">All</Chip>
          </Chip.Group>
        </Grid.Col>
      </Grid>

      <TextInput
          placeholder="Search by any field"
          mb="md"
          value={search}
          onChange={handleSearchChange}
          styles={(theme) => ({
            input: {
              color: theme.colors.dark[8]
            }
          })}
        />

      {populateStudents.length > 0 ? (
        <Table horizontalSpacing="md" verticalSpacing="xs" highlightOnHover fontSize="xs">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>E-mail</th>
              <th>Student ID</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <TableRow
              students={populateStudents}
              toggleDrawer={toggleDrawer}
              copyProfile={copyProfile}
              deleteProfile={deleteProfile}
            />
          </tbody>
        </Table>
      ) : (
        <Text align="center" weight="bold">
          No students found
        </Text>
      )}
    </Paper>
  );
}
