'use client';

import { useEffect, useState } from 'react';
import { Paper, Container, Box, Title, Text, Center, Button } from '@mantine/core';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

import { useStoreDispatch } from '@/lib/hooks';
import { studentAction } from '@/store/index';

import BatchTable from '@/components/common/table/batch-table/email';

interface AddStudentProps {
  data: any;
  batchNumber: number;
}

export default function BatchEmailPage({ data, batchNumber }: AddStudentProps) {
  const [batchData, setBatchData] = useState<any>(null);
  const [messageSent, setMessageSent] = useState<boolean>(false);

  const dispatch = useStoreDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(studentAction.loadStudents(data));
    dispatch(studentAction.loadBatches(data));

    const batch = data.filter((student: any) => student.batch === Number(batchNumber));
    setBatchData(batch);
  }, [data]);

  const handleBatchSubmit = async () => {
    console.log('batch submit');

    showNotification({
      title: 'Sending mass mail in progress',
      message: 'Please wait...',
      color: 'green',
      loading: true,
    });
    // setIsEmailSending(true);
    const res = await fetch('/api/send-email/bulk', {
      method: 'POST',
      body: JSON.stringify({ batchNumber }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { status, message } = await res.json();
    cleanNotifications();
    // setIsEmailSending(false);

    if (status === 250) {
      setMessageSent(true)
      cleanNotifications();

      showNotification({
        title: 'Mail sent',
        message: message,
        color: 'teal',
      });
      // dispatch(studentAction.updateStudentStatus({ id: student.id, status: "sent"}));
    } else {
      showNotification({
        title: 'Error',
        message: message,
        color: 'red',
        icon: '🚨',
      });
    }
  };

  if(messageSent){
    return(
      <Paper shadow="xs" p="xl">
      <Container p="xl">
        <Title order={3} weight={500} align="center" py={50}>
          Batch email is currently running on the background
        </Title>
        <Center>
            <Button mt={20} type="submit" onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </Center>
      </Container>
    </Paper>
    )
  }

  return (
    <Paper shadow="xs" p="xl">
      <Container p="xl">
        <Title order={3} weight={500} align="center" py={50}>
          Batch email to students of <i>{batchNumber}</i>
        </Title>
        <Box mx="auto">
          <Paper shadow="xs" p="md" withBorder>
            <Text py={10}>
              <BatchTable data={batchData} />
            </Text>
          </Paper>
          <Center>
            <Button mt={20} type="submit" onClick={handleBatchSubmit}>
              Send Batch Email
            </Button>
          </Center>
        </Box>
      </Container>
    </Paper>
  );
}
