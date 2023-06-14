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
      email: 'hoge@hoge.com',
      password: 'Hoge@123',
      confirmPassword: '',
      name: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => {
        if (value.length < 6) {
          return 'Password must be at least 6 characters long';
        }

        if (!/\d/.test(value)) {
          return 'Password must contain at least one number';
        }

        if (!/[a-z]/.test(value)) {
          return 'Password must contain at least one lowercase letter';
        }

        if (!/[A-Z]/.test(value)) {
          return 'Password must contain at least one uppercase letter';
        }

        return null;
      },
      ...(type === 'register' && {
        confirmPassword: (value, { password }) =>
          value === password ? null : 'Passwords must match',
          name: (value: string) =>
          value.length > 4 ? null : 'Name must be at least 5 characters long',
      }),
      //   ...(type === "register" && { name: (value) => value.length > 5 ? null : 'Name must be at least 6 characters long'}),
    },
  });

  const handleForm = (values: LoginCredentialsType) => {

    if (type === 'login') {
      signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        // @ts-ignore
      }).then(({ ok, error }) => {
        console.log(ok, error)
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
      }).catch((err) => {
        setLoading(false);
        showNotification({
          title: 'Opps!',
          message: err,
          color: 'red',
        });
      });
    } else {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      }).then(async (res) => {
        setLoading(false);
        if (res.status === 200) {
          showNotification({
            title: 'Account created!',
            message: 'Redirecting to login...',
            color: 'green',
          });
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          const errorMessage = await res.text();
          showNotification({
            title: 'Opps!',
            message: errorMessage,
            color: 'red',
          });
        }
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <form onSubmit={form.onSubmit(handleForm)}>
          <Title order={2} className={classes.title} align="center" mt="md" mb={50}>
            Welcome back to Dottax!
          </Title>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="hellouser"
              size="md"
              {...form.getInputProps('name')}
            />
          )}
          <br />
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
          {type === 'register' && (
            <PasswordInput
              label="Confirm Password"
              placeholder="Your password"
              mt="md"
              size="md"
              {...form.getInputProps('confirmPassword')}
            />
          )}

          {/* {type === 'login' && <Checkbox label="Keep me logged in" mt="xl" size="md" />} */}

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
            {type === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Anchor<'a'>
                  href="/register"
                  weight={700}
                  onClick={(event) => {
                    event.preventDefault();
                    router.push('/register');
                  }}
                >
                  Register
                </Anchor>
              </>
            ) : (
              <>
                Have an account?{' '}
                <Anchor<'a'>
                  href="/"
                  weight={700}
                  onClick={(event) => {
                    event.preventDefault();
                    router.push('/');
                  }}
                >
                  Login
                </Anchor>
              </>
            )}
          </Text>
        </form>
      </Paper>
    </div>
  );
}
