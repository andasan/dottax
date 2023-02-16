'use client';

import { useState } from 'react';
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';

import { LoadingDots } from '@/components/common/loading-dots';
import { LoginCredentialsType } from '@/types/component.types';

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export default function Form({ type }: { type: 'login' | 'register' }) {
  const [loading, setLoading] = useState(false);

  const { classes } = useStyles();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length > 5 ? null : 'Password must be at least 6 characters long',
    },
  });

  const handleForm = (values: LoginCredentialsType) => {
    signIn('credentials', {
      redirect: false,
      username: values.email,
      password: values.password,
      // @ts-ignore
    }).then(({ ok, error }) => {
      setLoading(false);
      if (ok) {
        router.push('/dashboard');
      } else {
        showNotification({
          title: 'Opps!',
          message: error,
          color: 'red',
        });
      }

      if (error) {
        showNotification({
          title: 'Opps!',
          message: error,
          color: 'red',
        });
      }
    });
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <form onSubmit={form.onSubmit(handleForm)}>
          <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
            Welcome back to Dottax!
          </Title>

          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />
          <Checkbox label="Keep me logged in" mt="xl" size="md" />

          <Button
            type="submit"
            disabled={loading}
            fullWidth
            mt="xl"
            size="md"
            className={`${
              loading
                ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                : 'border-indigo-900 bg-indigo-900 text-white hover:bg-white hover:text-indigi-900 hover:text-indigo-900'
            } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
          >
            {loading ? (
              <LoadingDots color="#808080" />
            ) : (
              <p>{type === 'login' ? 'Login' : 'Register'}</p>
            )}
          </Button>

          <Text align="center" mt="md">
            Don&apos;t have an account?{' '}
            <Anchor<'a'> href="#" weight={700} onClick={(event) => event.preventDefault()}>
              Register
            </Anchor>
          </Text>
        </form>
      </Paper>
    </div>
  );
}
