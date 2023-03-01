'use client';

import React, { Dispatch, useEffect, useMemo, useState } from "react";

import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { Badge, Chip, Divider, Drawer, Menu, Text, Title, Tooltip } from "@mantine/core";
import { useModals } from '@mantine/modals';
import { IconSend, IconEdit, IconMailForward, IconBackspace, IconDotsVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";

import EditProfileForm from "@/components/common/forms/edit-user";
import { useStudentStore } from "@/lib/zustand";
import { Student, MailingListTableProps } from "@/types/component.types";

export default function MailingListTable({ data, batch, pageSize }: MailingListTableProps) {
  const setStudents = useStudentStore((state) => state.setStudents);
  const removeBatch = useStudentStore((state) => state.removeBatch);
  const updateStudent = useStudentStore((state) => state.updateStudent);
  const students = useStudentStore((state) => state.students);

  const [emailMode, setEmailMode] = useState('all');
  const [tableData, setTableData] = useState<Student[]>(students);
  const [drawerOpened, toggleDrawer] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize, //customize the default page size
  });
  const router = useRouter();
  const modals = useModals();

  useEffect(() => {
    setStudents(data);
  }, []);

  useEffect(() => {
    const emailModeMap = {
      all: students,
      sent: students.filter(student => student.status === 'sent'),
      idle: students.filter(student => student.status === 'idle'),
      bounced: students.filter(student => student.status === 'bounced')
    } as Record<string, Student[]>;

    setTableData(emailModeMap[emailMode]);
  }, [students]);

  const onSubmitEditForm = async (student: Student) => {
    toggleDrawer(false);

    // Edit data in db
    const res = await fetch('/api/update-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student }),
    });

    if (!res.ok) {
      showNotification({
        title: 'Something went wrong!',
        message: `Unable to update student ${student.studentId}`,
        color: 'red',
      });
    } else {
      showNotification({
        title: 'Update Student',
        message: `You have successfully updated student ${student.studentId}`,
        color: 'teal',
      });

      updateStudent(student);
    }
  }

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
      removeBatch(batch);
      router.push('/dashboard');
    }
  };

  const handleEmailMode = (value: any) => {
    switch (value) {
      case 'sent':
      case 'idle':
      case 'bounced':
        setTableData(
          students.filter(
            (item: Student) => item.status.toLowerCase() === value.toLowerCase()
          )
        );
        break;
      default:
        setTableData(students);
        break;
    }

    setEmailMode(value);
  };

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    {
      accessorKey: "firstName",
      header: "First Name",
      size: 200
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      size: 200
    },
    {
      accessorKey: "email",
      enableClickToCopy: true,
      header: "Email",
      size: 200
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 200,
      Cell: ({ cell }) => {
        const status = cell.getValue() as string;
        const reason = cell.row.original.bouncedReason || undefined;
        return (
          <Tooltip sx={{ overflowWrap: "break-word" }} label={reason || status} color="yellow" multiline width={reason ? 250 : 100} position="left" transition="skew-up" transitionDuration={300}>
            <Badge color={status === 'idle' && 'yellow' || status === 'bounced' ? 'red' : 'blue'}>{status}</Badge>
          </Tooltip>
        )
      },
      filterFn: 'equals',
      mantineFilterSelectProps: {
        data: ['Idle', 'Sent', 'Bounced'] as any,
      },
      filterVariant: 'select',
    }
  ], []);

  return (
    <MantineReactTable
      columns={columns}
      data={tableData}
      enableColumnOrdering
      onPaginationChange={setPagination} //hoist pagination state to your state when it changes internally
      state={{ pagination }} //pass the pagination state to the table
      mantineFilterTextInputProps={{
        sx: { borderBottom: 'unset', marginTop: '8px' },
        variant: 'filled',
      }}
      mantineFilterSelectProps={{
        sx: { borderBottom: 'unset', marginTop: '8px' },
        variant: 'filled',
      }}
      mantineTopToolbarProps={{
        sx: { zIndex: 5 },
      }}
      enableStickyHeader
      enablePinning
      enableRowActions
      // enableRowSelection
      initialState={{ showColumnFilters: true }}
      positionToolbarAlertBanner="bottom"
      renderRowActionMenuItems={({ row }) => (
        <RowActions student={row.original} toggleDrawer={toggleDrawer} />
      )}
      renderTopToolbarCustomActions={({ table }) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Drawer
            opened={drawerOpened}
            onClose={() => toggleDrawer(false)}
            title="Modify Student Profile"
            padding="xl"
            size="xl"
          >
            <EditProfileForm submitForm={onSubmitEditForm} />
          </Drawer>

          <Title order={2}>Batch {batch}</Title>

          <Menu>
            <Menu.Target>
              <IconDotsVertical size={18} style={{ cursor: 'pointer' }} />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Batch Menu</Menu.Label>
              <Menu.Item
                icon={<IconSend size={18} />}
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

          <Chip.Group value={emailMode} onChange={handleEmailMode} spacing="sm" style={{ justifyContent: "flex-end", alignItems: "center" }}>
            <Chip value="idle">Idle</Chip>
            <Chip value="sent">Sent</Chip>
            <Chip value="bounced">Bounced</Chip>
            <Chip value="all">All</Chip>
          </Chip.Group>
        </div>
      )
      }
    />
  );
}


const RowActions = ({ student, toggleDrawer }: { student: Student, toggleDrawer: Dispatch<React.SetStateAction<boolean>>; }) => {
  const modals = useModals();
  const setSelectedStudent = useStudentStore(state => state.setSelectedStudent);
  const updateStudentState = useStudentStore(state => state.updateStudentState);
  const removeStudent = useStudentStore(state => state.removeStudent);

  const handleSendEmail = async (student: Student) => {
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

    if (status === 250) {
      showNotification({
        title: 'Mail sent',
        message: message,
        color: 'teal',
      });

      updateStudentState({ ...student, status: "sent" })

    } else {
      showNotification({
        title: 'Error',
        message: message,
        color: 'red',
        icon: '🚨',
      });
    }
  }

  const deleteProfile = async (student: Student) => {
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

    removeStudent(student.id);

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

  return (
    <>
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
          setSelectedStudent(student);
          toggleDrawer(true);
        }}
      >
        Edit Profile
      </Menu.Item>
      <Divider />
      <Menu.Item
        icon={<IconBackspace size={14} />}
        onClick={() => deleteProfile(student)}
        color="red"
      >
        Delete Profile
      </Menu.Item>
    </>
  )
}