'use client';

import { useEffect, useState } from 'react';
import { Paper, Container, Box, Group, Title, Text, useMantineTheme, Button } from '@mantine/core';

import { formatBytes } from '@/utils/formatBytes';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconX, IconFileDelta } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';

export default function FileUploadPage() {
  const [fileState, setFileState] = useState<any>(null);
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      batchNumber: 0,
      file: null,
    },

    validate: {
      batchNumber: (value) => (value === null ? 'Please select a batch number' : null),
      file: (value) => (value === null ? 'Please upload a file' : null),
    },
  });

  useEffect(() => {
    form.setFieldValue('file', fileState);
    console.log('fileState', fileState);
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

  const handleSubmit = async () => {
    const formData = new FormData();
    fileState.forEach((file: any) => formData.append('media', file));

    const res = await fetch('/api/file-upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if(data.error){
      showNotification({
        title: 'Opps!',
        message: data.error,
        color: 'red',
      });
      return;
    }

    showNotification({
      title: 'Success!',
      message: 'File uploaded successfully',
      color: 'green',
    });
  };

  return (
    <Paper shadow="xs" p="xl">
      <Container p="xl">
        <Title order={3} weight={100} align="center" py={50}>
          Upload a Single/Multiple PDF Files
        </Title>
        <Box mx="auto">
          <Dropzone
            onDrop={setFileState}
            onReject={(files) => console.log('rejected files', files)}
            accept={PDF_MIME_TYPE}
            {...form.getInputProps('file')}
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
                <IconFileDelta size={50} stroke={1.5} />
              </Dropzone.Idle>

              <div>
                {fileState ? (
                  <>
                    <Text size="xl" inline>
                      Number of files: {fileState?.length}
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      Total Size:{' '}
                      {formatBytes(fileState.reduce((a: number, c: any) => a + c.size, 0))}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text size="xl" inline>
                      Drop PDFs here or click to select files
                    </Text>
                    <Text size="sm" color="dimmed" inline mt={7}>
                      Each file should not exceed 5mb
                    </Text>
                  </>
                )}
              </div>
            </Group>
          </Dropzone>

          <Group position="center" mt="xl">
            <Button onClick={handleSubmit}>Submit</Button>
          </Group>
        </Box>
      </Container>
    </Paper>
  );
}
