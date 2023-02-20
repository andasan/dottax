import { useState } from 'react';
import { Table, Drawer, Text, Skeleton } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';

import { useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store/index';
import EditUserForm from '@/components/common/forms/edit-user';
import TableRow from './table-row';

import { Student } from '@/types/schema.types';

export default function RecentActivityTable(/*props*/) {
  const { populateStudents, loading } = useStoreSelector(studentState);
  const clipboard = useClipboard();
  const modals = useModals();

  const [students, setStudents] = useState<Student[]>(populateStudents);
  const [drawerOpened, toggleDrawer] = useState(false);
  const [selectedProfileData, setSelectedProfileData] = useState<Student>();

  const onSubmitEditForm = async (student: any) => {
    toggleDrawer(false);

    // Edit data in db
    const res = await fetch("/api/update-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({student})
    });

    // In case we need to return data from the server
    // const data = await res.json();

    if(!res.ok) {
      showNotification({
        title: 'Something went wrong!',
        message: `Unable to edit ${student.firstName}'s profile`,
        color: 'red',
      });
    }else{
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
      <Drawer
        opened={drawerOpened}
        onClose={() => toggleDrawer(false)}
        title="Modify Student Profile"
        padding="xl"
        size="xl"
      >
        <EditUserForm submitForm={onSubmitEditForm} />
      </Drawer>

      {populateStudents.length > 0 ? (
          <Table highlightOnHover verticalSpacing="md" fontSize="xs">
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
    </>
  );
}

