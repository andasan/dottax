import { Button, TextInput, Switch, Select } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useStudentStore } from '@/lib/zustand';
import { Student } from '@/types/component.types';

interface EditProfileFormProps {
  submitForm: (student: Student) => Promise<void>
}

export default function EditProfileForm({ submitForm }: EditProfileFormProps) {
  const selectedStudent = useStudentStore((state) => state.selectedStudent);

  const form = useForm({
    initialValues: selectedStudent,

    validate: {
      firstName: (value) => (value.length > 0 ? null : 'First name is required'),
      lastName: (value) => (value.length > 0 ? null : 'Last name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      studentId: (value) => (value.length > 0 ? null : 'Student ID is required'),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(submitForm)}
    >
      <TextInput label="First Name" placeholder="First Name" {...form.getInputProps('firstName')} />
      <TextInput
        mt={20}
        label="Last Name"
        placeholder="Last Name"
        {...form.getInputProps('lastName')}
      />
      <TextInput mt={20} label="E-mail" placeholder="E-mail" {...form.getInputProps('email')} />
      <TextInput
        mt={20}
        label="Student ID"
        placeholder="Student ID"
        {...form.getInputProps('studentId')}
      />
      <Select
        data={['idle', 'sent', 'bounced']}
        mt={20}
        label="Status"
        placeholder="Status"
        {...form.getInputProps('status')}
      />
      {/* <Switch
        mt={20}
        size="lg"
        onLabel="Sent"
        offLabel="Idle"
        label="Status"
        checked={form.values.status === 'sent' ? true : false}
        onChange={(event) =>
          form.setFieldValue('status', event.currentTarget.checked ? 'sent' : 'idle')
        }
      /> */}

      <Button mt={20} type="submit">
        Edit
      </Button>
    </form>
  );
}
