'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useMantineTheme,
  Paper,
  Container,
  Stepper,
  Button,
  Group,
  Title,
  TextInput,
  Text,
  Box,
  Select,
} from '@mantine/core';
import { IconUpload, IconFileSpreadsheet, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Dropzone, MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';

import { useStoreDispatch } from '@/lib/hooks';
import { studentAction } from '@/store/index';
import { formatBytes } from '@/utils/formatBytes';
import { readFile } from '@/utils/readFile';

import BatchTable from '@/components/common/table/batch-table';

interface AddBatchProps {
  data: any;
}

export default function AddBatchPage({ data }: AddBatchProps) {
  const dispatch = useStoreDispatch();
  const router = useRouter();

  const [studentRecords, setStudentRecords] = useState<any>([]);

  useEffect(() => {
    dispatch(studentAction.loadStudents(data));
    dispatch(studentAction.loadBatches(data));
  }, [data]);

  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: {
      batchNumber: 0,
      file: null,
    },

    validate: {
      batchNumber: (value) => (typeof value === 'number' ? 'Invalid number' : null),
      file: (value) => (value === null ? 'Please upload a file' : null),
    },
  });

  //step handler
  const handleStep = () => {
    setActive((current) => {
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
      return current < 3 ? current + 1 : current;
    });
  };

  const handleSubmit = async () => {
    //submit form to server

    const remapRecords = studentRecords.slice(1).map((item: any) => {
      return {
        firstName: item[0],
        lastName: item[1],
        email: item[2],
        studentId: String(item[3]),
        batch: Number(form.values.batchNumber),
      };
    });

    try {
      //save  to database
      const res = await fetch('/api/add-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remapRecords }),
      });

      // In case we need to return data from the server
      const data = await res.json();

      if (!res.ok) {
        showNotification({
          title: 'Something went wrong!',
          message: `Unable to add students to database`,
          color: 'red',
        });
      } else {
        showNotification({
          title: 'Upload successful!',
          message: `You have successfully added new students to the database`,
          color: 'teal',
        });
      }

      nextStep();
    } catch (err: any) {
      showNotification({
        title: 'Something went wrong!',
        message: err.message,
        color: 'red',
      });
    }
  };

  return (
    <Paper shadow="xs" p="xl">
      <Container size="md" px="xs" pt={20}>
        <form onSubmit={form.onSubmit((values: any) => console.log(values))}>
          <Stepper active={active} breakpoint="sm">
            <Stepper.Step label="First step" description="Input a batch">
              <StepOne form={form} />
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Upload a file">
              <StepTwo form={form} />
            </Stepper.Step>
            <Stepper.Step label="Third step" description="Confirmation">
              <StepThree form={form} setStudentRecords={setStudentRecords} />
            </Stepper.Step>
            <Stepper.Completed>
              <Container p="xl">
                <Title order={3} weight={100} align="center" py={50}>
                  New batch added successfully
                </Title>
              </Container>
            </Stepper.Completed>
          </Stepper>

          <Group position="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            {active === 3 ? (
              <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
            ) : active === 2 ? (
              <Button onClick={handleSubmit}>Submit</Button>
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
      </Box>
    </Container>
  );
};

interface IStepThreeProps {
  form: any;
  setStudentRecords: (records: any[]) => void;
}

const StepThree = ({ form, setStudentRecords }: IStepThreeProps) => {
  const [data, setData] = useState<any[]>([]);

  const handleReadFile = async (spreadSheetFile: any) => {
    // const file = spreadSheetFile.path;
    const jsonData = await readFile(spreadSheetFile);
    setData(jsonData);
    setStudentRecords(jsonData);
  };

  useEffect(() => {
    if (Object.keys(form.errors).length > 0) {
      console.log('form errors', form.errors);
    } else {
      handleReadFile(form.values.file);
    }
  }, [form]);

  return (
    <Container p="xl">
      <Title order={3} weight={100} align="center" py={50}>
        Confirm the uploaded details
      </Title>
      <Box mx="auto">
        <Paper shadow="xs" p="md" withBorder>
          <Text py={10}>
            Batch Number: <b>{form.values?.batchNumber}</b>
          </Text>
          <Text py={10}>
            File: <b>{form.values?.file?.name}</b>{' '}
            <small>({formatBytes(form.values?.file.size)})</small>
          </Text>
          <Text py={10}>
            No. of students: <b>{data.length}</b>
            <BatchTable data={data} />
          </Text>
        </Paper>
      </Box>
    </Container>
  );
};
