import { Student } from '@/types/schema.types';
import { Button, TextInput, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useStoreDispatch, useStoreSelector } from '@/lib/hooks';
import { modalAction, studentAction, toggleState, studentState } from '@/store/index';

interface EditProfileFormProps {
  submitForm: (newUser: Student) => void;
}

export default function EditProfileForm({ submitForm }: EditProfileFormProps) {
  const { studentSelected: data } = useStoreSelector(studentState);
  const dispatch = useStoreDispatch();

  const form = useForm({
    initialValues: data,

    validate: {
      firstName: (value) => (value.length > 0 ? null : 'First name is required'),
      lastName: (value) => (value.length > 0 ? null : 'Last name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      studentId: (value) => (value.length > 0 ? null : 'Student ID is required'),
      status: (value) => (value.length > 0 ? null : 'Status is required'),
    },
  });

  return (
    // <form onSubmit={form.onSubmit((values) => submitForm(data, values))}>
    <form
      onSubmit={form.onSubmit((values) => {
        submitForm(values)
        dispatch(studentAction.updateStudent(values));
      })}
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
      <Switch
        mt={20}
        size="lg"
        onLabel="Sent"
        offLabel="Pending"
        label="Status"
        checked={form.values.status === 'sent' ? true : false}
        onChange={(event) =>
          form.setFieldValue('status', event.currentTarget.checked ? 'sent' : 'pending')
        }
      />

      <Button mt={20} type="submit">
        Edit
      </Button>
    </form>
  );
}
