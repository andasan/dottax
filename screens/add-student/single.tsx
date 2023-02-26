import {
    Paper,
    Text,
    TextInput,
    Textarea,
    Button,
    Group,
    SimpleGrid,
    createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

const useStyles = createStyles((theme) => {
    const BREAKPOINT = theme.fn.smallerThan('sm');

    return {
        wrapper: {
            display: 'flex',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            borderRadius: theme.radius.lg,
            padding: 4,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[2]
                }`,

            [BREAKPOINT]: {
                flexDirection: 'column',
            },
        },

        form: {
            boxSizing: 'border-box',
            flex: 1,
            padding: theme.spacing.xl,
            paddingLeft: theme.spacing.xl * 2,
            borderLeft: 0,

            [BREAKPOINT]: {
                padding: theme.spacing.md,
                paddingLeft: theme.spacing.md,
            },
        },

        fields: {
            marginTop: -12,
        },

        fieldInput: {
            flex: 1,

            '& + &': {
                marginLeft: theme.spacing.md,

                [BREAKPOINT]: {
                    marginLeft: 0,
                    marginTop: theme.spacing.md,
                },
            },
        },

        fieldsGroup: {
            display: 'flex',

            [BREAKPOINT]: {
                flexDirection: 'column',
            },
        },

        title: {
            marginBottom: theme.spacing.xl * 1.5,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,

            [BREAKPOINT]: {
                marginBottom: theme.spacing.xl,
            },
        },

        control: {
            [BREAKPOINT]: {
                flex: 1,
            },
        },
    };
});

export default function SingleStudent({ batch }: { batch: number }) {
    const { classes } = useStyles();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            studentId: '',
            batch: Number(batch),
        },

        validate: {
            firstName: (value) => (value.length > 0 ? null : 'First name is required'),
            lastName: (value) => (value.length > 0 ? null : 'Last name is required'),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            studentId: (value) => (value.length > 0 ? null : 'Student ID is required'),
        },
    });

    const onSubmitAddForm = async (student: any) => {

        // Add data in db
        const res = await fetch('/api/add-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ student }),
        });

        const data = await res.json();
        console.log("Added data: ",data);

        if (!res.ok) {
          showNotification({
            title: 'Something went wrong!',
            message: `Unable to add ${student.firstName}'s profile`,
            color: 'red',
          });
        } else {
          showNotification({
            title: 'Edit profile',
            message: `You have successfully added ${student.firstName}'s profile`,
            color: 'teal',
          });
        }

        //redirect to student list after 3 seconds
        setTimeout(() => {
            router.push(`/students/${batch}`);
        }, 3000);
      };

    return (
        <Paper shadow="md" radius="lg">
            <div className={classes.wrapper}>

                <form className={classes.form} onSubmit={form.onSubmit((values) => onSubmitAddForm(values))}>
                    <Text size="lg" weight={700} className={classes.title}>
                        Student Information
                    </Text>

                    <div className={classes.fields}>
                        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                            <TextInput label="First name" placeholder="First name" required {...form.getInputProps('firstName')} />
                            <TextInput label="Last name" placeholder="Last name" required {...form.getInputProps('lastName')} />
                        </SimpleGrid>

                        <TextInput mt="md" label="Email" placeholder="hello@student.com" required {...form.getInputProps('email')} />
                        <TextInput mt="md" label="Student ID" placeholder="20231234" required {...form.getInputProps('studentId')} />
                        <TextInput mt="md" label="Batch" readOnly {...form.getInputProps('batch')} type="number" />

                        <Group position="right" mt="md">
                            <Button type="submit" className={classes.control}>
                                Add Student
                            </Button>
                        </Group>
                    </div>
                </form>
            </div>
        </Paper>
    );
}