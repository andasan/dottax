'use client';

import { useEffect, useState } from 'react';
import { Paper, Container, Box, Title, Text, Center, Button } from '@mantine/core';
import { cleanNotifications, showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

import { useStoreDispatch, useStoreSelector } from '@/lib/hooks';
import { studentAction, studentState } from '@/store/index';

import BatchTable from '@/components/common/table/batch-table/email';
import { Student } from '@/types/schema.types';
import Link from 'next/link';

export default function BatchEmailPage({ batch }: { batch: number }) {
  const [batchData, setBatchData] = useState<any>(null);
  const [messageSent, setMessageSent] = useState<boolean>(false);

  const { studentsByBatch } = useStoreSelector(studentState)
  const dispatch = useStoreDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(studentAction.loadStudentsByBatch(batch));
  }, []);

  useEffect(() => {
    setBatchData(studentsByBatch.filter(student => student.status === 'idle').slice(0, 10));
  }, [studentsByBatch]);

  const handleBatchSubmit = async () => {

    showNotification({
      title: 'Sending mass mail in progress',
      message: 'Please wait...',
      color: 'green',
      loading: true,
    });
    // setIsEmailSending(true);
    const res = await fetch('/api/send-email/bulk', {
      method: 'POST',
      body: JSON.stringify({ batch }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { status, message, data } = await res.json();
    cleanNotifications();
    // setIsEmailSending(false);

    if (status >= 200 && status < 300) {
      setMessageSent(true)
      cleanNotifications();

      showNotification({
        title: 'Mail sent',
        message: message,
        color: 'teal',
      });

      dispatch(studentAction.updateSelectedStudentStatus(data));

    } else {
      showNotification({
        title: 'Error',
        message: message,
        color: 'red',
        icon: '🚨',
      });
    }
  };

  if (messageSent) {
    return (
      <Paper shadow="xs" p="xl">
        <Container p="xl">
          <Title order={3} weight={500} align="center" py={50}>
            Batch email is currently running on the background
          </Title>
          <Center>
            <Button mt={20} mx={20} type="submit" href={`/students/${batch}`} component={Link}>
              Send another batch email
            </Button>
            <Button mt={20} mx={20} type="submit" href={`/dashboard`} component={Link}>
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
          Batch email to students of <i>{batch}</i>
        </Title>
        <Box mx="auto">
          <Paper shadow="xs" p="md" withBorder>
            <Text py={10}>
              <BatchTable data={batchData} />
            </Text>
          </Paper>
          <Center>
            {batchData && batchData.length > 0 ? (
              <Button mt={20} type="submit" onClick={handleBatchSubmit}>
                Send Batch Email
              </Button>
            ):(
              <Button mt={20} type="submit" href={`/students/${batch}`} component={Link}>
                Return to Student List
              </Button>
            )}
          </Center>
        </Box>
      </Container>
    </Paper>
  );
}
