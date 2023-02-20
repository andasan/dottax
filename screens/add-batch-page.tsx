'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Container,
  Stepper,
  Button,
  Group,
  Center,
  Title,
  TextInput,
  Divider,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dropzone } from '@mantine/dropzone';

import { useStoreDispatch } from '@/lib/hooks';
import { studentAction } from '@/store/index';

interface AddBatchProps {
  data: any;
}

export default function AddBatchPage({ data }: AddBatchProps) {
  // const { populateStudents, loading } = useStoreSelector(studentState);
  const dispatch = useStoreDispatch();

  useEffect(() => {
    dispatch(studentAction.loadStudents(data));
  }, [data]);

  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: {
      email: '',
      termsOfService: false,
      batchNumber: 0,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      batchNumber: (value) => (typeof value === 'number') ? 'Invalid number' : null,
    },
  });

  return (
    <Paper shadow="xs" p="xl">
      <Container size="md" px="xs" pt={20}>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="First step" description="Input a batch">
            <StepOne form={form} />
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            <StepTwo form={form} />
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
      </form>


      </Container>
    </Paper>
  );
}

const StepOne = ({ form }: { form: any }) => {
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
    const openRef = useRef<() => void>(null);



  return (
    <Container p="xl">
      <Title order={3} weight={100} align="center" py={50}>
        Step 2: Upload a CSV file
      </Title>
      <Box sx={{ maxWidth: 300 }} mx="auto">

      <Dropzone openRef={openRef}>
        {/* children */}
      </Dropzone>

      <Group position="center" mt="md">
        <Button onClick={() => openRef.current()}>Select files</Button>
      </Group>

      </Box>
    </Container>
  );
};
