'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  useMantineTheme,
  Paper,
  Container,
  Stepper,
  Button,
  Group,
  Center,
  Title,
  TextInput,
  Text,
  Box,
} from '@mantine/core';
import { IconUpload, IconPhoto, IconFileSpreadsheet, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Dropzone, MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';

import { useStoreDispatch } from '@/lib/hooks';
import { studentAction } from '@/store/index';
import { formatBytes } from '@/utils/formatBytes';


interface AddBatchProps {
  data: any;
}

export default function AddBatchPage({ data }: AddBatchProps) {
  const dispatch = useStoreDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(studentAction.loadStudents(data));
  }, [data]);

  const [active, setActive] = useState(0);
//   const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: {
      email: '',
      termsOfService: false,
      batchNumber: 0,
      file: null,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      batchNumber: (value) => (typeof value === 'number' ? 'Invalid number' : null),
      file: (value) => (value === null ? 'Please upload a file' : null),
    },
  });

  //step handler
  const handleStep = () => {
    setActive((current) => {
      console.log(current);
      if (current === 0) {
        //validate bach number
        if (form.values.batchNumber === 0) {
          form.setFieldError('batchNumber', 'Please enter a valid batch number');
          return current;
        }
      } else if (current === 1) {
        //validate file
        if (form.values.file === null) {
          form.setFieldError('file', 'Please upload a file');
          return current;
        }
      }
      return current < 2 ? current + 1 : current;
    });
  };

  return (
    <Paper shadow="xs" p="xl">
      <Container size="md" px="xs" pt={20}>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stepper active={active}  breakpoint="sm">
            <Stepper.Step label="First step" description="Input a batch">
              <StepOne form={form} />
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Verify email">
              <StepTwo form={form} />
            </Stepper.Step>
            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>

          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            {/* redirect to dashboard */}
            {active === 2 ? (
              <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
            ) : (
              <Button onClick={handleStep}>Next step</Button>
            )}
          </Group>
        </form>
      </Container>
    </Paper>
  );
}

const StepOne = ({ form }: { form: any }) => {
  //check for form error
  useEffect(() => {
    if (form.errors.batchNumber) {
      showNotification({
        title: 'Opps!',
        message: form.errors.batchNumber,
        color: 'red',
      });
    }
  }, [form.errors.batchNumber]);

  return (
    <Container p="xl">
      <Title order={3} weight={100} align="center" py={50}>
        Step 1: Input a batch number
      </Title>
      <Box sx={{ maxWidth: 300 }} mx="auto">
        <TextInput label="Batch Number" type="number" {...form.getInputProps('batchNumber')} />
      </Box>
    </Container>
  );
};

const StepTwo = ({ form }: { form: any }) => {
  const [fileState, setFileState] = useState<any>(null);
  // const openRef = useRef<() => void>(null);
  const theme = useMantineTheme();

  useEffect(() => {
    form.setFieldValue('file', fileState);
  }, [fileState]);

  //check for form error
  useEffect(() => {
    if (form.errors.file) {
      showNotification({
        title: 'Opps!',
        message: form.errors.file,
        color: 'red',
      });
    }
  }, [form.errors.file]);

  return (
    <Container p="xl">
      <Title order={3} weight={100} align="center" py={50}>
        Step 2: Upload a CSV file
      </Title>
      <Box mx="auto">
        <Dropzone
          onDrop={(files) => setFileState(files[0])}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={3 * 1024 ** 2}
          accept={MS_EXCEL_MIME_TYPE}
          {...form.getInputProps('file')}
          //   {...props}
        >
          <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFileSpreadsheet size={50} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              {fileState ? (
                <>
                  <Text size="xl" inline>
                    Filename: {fileState?.name}
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    Size: {formatBytes(fileState?.size)}
                  </Text>
                </>
              ) : (
                <>
                  <Text size="xl" inline>
                    Drag spreadsheet here or click to select files
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    File should not exceed 5mb
                  </Text>
                </>
              )}
            </div>
          </Group>
        </Dropzone>

        {/* <Group position="center" mt="md">
        <Button onClick={() => openRef.current()}>Select files</Button>
      </Group> */}
      </Box>
    </Container>
  );
};
