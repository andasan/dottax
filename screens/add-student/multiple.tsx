import { useState, useEffect, useRef, memo, useCallback, RefObject } from 'react';
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
  createStyles,
} from '@mantine/core';
import { IconUpload, IconFileSpreadsheet, IconX, IconCloudUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Dropzone, MS_EXCEL_MIME_TYPE } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';

import { formatBytes } from '@/utils/formatBytes';
import { readFile } from '@/utils/readFile';

import BatchTable from '@/components/common/table/batch-table';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20,
  },
}));

const MultipleStudents = ({ batch }: { batch: number }) => {
  const router = useRouter();
  const [studentRecords, setStudentRecords] = useState<any>([]);

  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const openRef = useRef<() => void>(null);

  const form = useForm({
    initialValues: {
      batch,
      file: null,
    },

    validate: {
      file: (value) => (value === null ? 'Please upload a file' : null),
    },

  });

  //step handler
  const handleStep = () => {
    setActive((current) => {
      if (current === 1) {
        //validate file
        if (form.values.file === null) {
          form.setFieldError('file', 'Please upload a file');
          return current;
        }
      }

      return current < 2 ? current + 1 : current;
    });
  };

  const handleSubmit = async () => {
    //submit form to server

    const remapRecords = () => studentRecords.slice(1).map((item: any) => {
      return {
        firstName: item[0],
        lastName: item[1],
        email: item[2],
        studentId: String(item[3]),
        batch: Number(batch),
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
    <form onSubmit={form.onSubmit((values: any) => console.log(values))}>
      <Stepper active={active} breakpoint="sm">
        <Stepper.Step label="First step" description="Upload a file">
          <StepOne form={form} openRef={openRef} />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Confirmation">
          <StepTwo form={form} setStudentRecords={setStudentRecords} />
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
        {active === 2 ? (
          <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
        ) : active === 1 ? (
          <Button onClick={handleSubmit}>Submit</Button>
        ) : (
          <Button onClick={handleStep}>Next step</Button>
        )}
      </Group>
    </form>
  )
};

export default MultipleStudents;

const StepOne = ({ form, openRef }: { form: any, openRef: RefObject<() => void> }) => {
  const [fileState, setFileState] = useState<any>(null);
  const theme = useMantineTheme();
  const { classes } = useStyles();

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
      <Title order={3} weight={100} align="center" pb={10}>
        Step 1: Upload a CSV file
      </Title>
      <Box mx="auto">
      <div className={classes.wrapper}>
        <Dropzone
          onDrop={(files) => setFileState(files[0])}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={3 * 1024 ** 2}
          accept={MS_EXCEL_MIME_TYPE}
          openRef={openRef}
          className={classes.dropzone}
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
              <IconCloudUpload size={50} stroke={1.5} />
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

        <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
          Select files
        </Button>
        </div>
      </Box>
    </Container>
  );
};

interface IStepTwoProps {
  form: any;
  setStudentRecords: (records: any[]) => void;
}

const StepTwo = ({ form, setStudentRecords }: IStepTwoProps) => {
  const [data, setData] = useState<any[]>([]);

  const handleReadFile = async (spreadSheetFile: any) => {
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
  }, []);

  console.log("step 2")
  // console.log(form)

  return (
    <Container p="xl">
      <Title order={3} weight={100} align="center" pb={10}>
        Confirm the uploaded details
      </Title>
      <Box mx="auto">
        <Paper shadow="xs" p="md" withBorder>
          <Text py={10}>
            Batch Number: <b>{form?.values?.batch}</b>
          </Text>
          <Text py={10}>
            File: <b>{form.values?.file?.name}</b>{' '}
            <small>({formatBytes(form.values?.file.size)})</small>
          </Text>
          <Text py={10}>

            No. of students: <b>{data.length - 1}</b>
            <BatchTable data={data} />
          </Text>
        </Paper>
      </Box>
    </Container>
  );
};
