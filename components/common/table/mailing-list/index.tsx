'use client';

import React, { Dispatch, useEffect, useMemo, useState } from "react";

import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { Badge, Box, Button, Divider, Drawer, Menu, Text, Title } from "@mantine/core";
import { useModals } from '@mantine/modals';
import { IconUserCircle, IconSend, IconDeviceFloppy, IconEdit, IconMailForward, IconBackspace, IconDotsVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";

import EditProfileForm from "@/components/common/forms/edit-user";
import { useStoreSelector, useStoreDispatch } from '@/lib/hooks';
import { studentState, studentAction } from '@/store/index';
import { BatchData } from "@/types/component.types";
import { fetchDataIfEmpty } from "@/store/thunk";

interface MailingListTableProps {
  batchData: BatchData[];
  batch: number;
  pageSize: number;
}


export default function MailingListTable({ batchData: data, batch, pageSize }: MailingListTableProps) {
  const [drawerOpened, toggleDrawer] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize, //customize the default page size
  });
  const router = useRouter();
  const modals = useModals();
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(studentAction.loadStudentsByBatch(batch));
  }, [batch]);

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
      router.push('/dashboard');

      //update redux to remove batch
      dispatch(studentAction.deleteBatch(batch));
    }
  };

  const columns = useMemo<MRT_ColumnDef<BatchData>[]>(() => [
    {
      accessorKey: "firstName", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
      enableClickToCopy: true,
      header: "First Name",
      size: 200
    },
    {
      accessorKey: "lastName", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
      enableClickToCopy: true,
      header: "Last Name",
      size: 200
    },
    {
      accessorKey: "email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
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
        return (
          <Badge color={status === 'idle' ? 'yellow' : 'blue'}>{status}</Badge>
        )
      },
      filterFn: 'equals',
      mantineFilterSelectProps: {
        data: ['Idle', 'Sent'] as any,
      },
      filterVariant: 'select',
    }
  ], []);

  return (
    <MantineReactTable
      columns={columns}
      data={data}
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

      enablePinning
      enableRowActions
      // enableRowSelection
      initialState={{ showColumnFilters: false }}
      positionToolbarAlertBanner="bottom"
      renderRowActionMenuItems={({ row }) => (
        <RowActions student={row.original} toggleDrawer={toggleDrawer} />
      )}
      renderTopToolbarCustomActions={({ table }) => {
        // const handleDeactivate = () => {
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     alert("deactivating " + row.getValue("name"));
        //   });
        // };

        // const handleActivate = () => {
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     alert("activating " + row.getValue("name"));
        //   });
        // };

        // const handleContact = () => {
        //   const allStudents = table.getSelectedRowModel().flatRows.map((row) => ({
        //     firstName: row.getValue("firstName"),
        //     lastName: row.getValue("lastName"),
        //     email: row.getValue("email"),
        //   }));
        // };

        return (
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
            {/* <Button
              color="red"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeactivate}
              variant="filled"
            >
              Deactivate
            </Button>
            <Button
              color="green"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant="filled"
            >
              Activate
            </Button>
            <Button
              color="blue"
              disabled={!table.getIsAllRowsSelected()}
              onClick={handleContact}
              variant="filled"
            >
              Contact
            </Button> */}
          </div>
        );
      }}
    />
  );
}


const RowActions = ({ student, toggleDrawer }: { student: BatchData, toggleDrawer: Dispatch<React.SetStateAction<boolean>>; }) => {
  const modals = useModals();
  const dispatch = useStoreDispatch();

  const handleSendEmail = async (student: BatchData) => {
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
      dispatch(studentAction.updateStudentStatus({ id: student.id, status: "sent" }));
    } else {
      showNotification({
        title: 'Error',
        message: message,
        color: 'red',
        icon: '🚨',
      });
    }
  }

  const deleteProfile = async (student: BatchData) => {
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

  const onDeleteProfile = async (student: BatchData) => {
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
          dispatch(studentAction.selectedProfileData(student));
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