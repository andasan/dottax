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
//   import { ContactIconsList } from '../ContactIcons/ContactIcons';
//   import bg from './bg.svg';

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

        contacts: {
            boxSizing: 'border-box',
            position: 'relative',
            borderRadius: theme.radius.lg - 2,
            // backgroundImage: `url(${bg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid transparent',
            padding: theme.spacing.xl,
            flex: '0 0 280px',

            [BREAKPOINT]: {
                marginBottom: theme.spacing.sm,
                paddingLeft: theme.spacing.md,
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

    return (
        <Paper shadow="md" radius="lg">
            <div className={classes.wrapper}>

                <form className={classes.form} onSubmit={(event) => event.preventDefault()}>
                    <Text size="lg" weight={700} className={classes.title}>
                        Student Information
                    </Text>

                    <div className={classes.fields}>
                        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                            <TextInput label="First name" placeholder="First name" required />
                            <TextInput label="Last name" placeholder="Last name" required />
                        </SimpleGrid>

                        <TextInput mt="md" label="Email" placeholder="hello@student.com" required />
                        <TextInput mt="md" label="Student ID" placeholder="20231234" required />
                        <TextInput mt="md" label="Batch" value={batch} readOnly />

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