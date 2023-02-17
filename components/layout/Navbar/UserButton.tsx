

import type { UnstyledButtonProps } from '@mantine/core';

import { createStyles, Group, Text, UnstyledButton, Menu, Button } from '@mantine/core';
import { IconChevronRight, IconLogout } from '@tabler/icons-react';
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import Avatar from 'react-avatar';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

export function UserButton({ image, name, email, icon, ...others }: UserButtonProps) {
  const { data: session, status } = useSession()
  const { classes } = useStyles();

  return (
    <Menu position="right-start" withArrow>
      <Menu.Target>
        <UnstyledButton className={classes.user} {...others}>
          <Group>
            <Avatar name={session?.user?.name || "Guest"} size="40" textSizeRatio={1.75} round />

            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
              {session?.user?.name}
              </Text>

              <Text color="dimmed" size="xs">
                {session?.user?.email}
              </Text>
            </div>

            {icon || <IconChevronRight size={14} stroke={1.5} />}
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item color="red" icon={<IconLogout size={14} />} onClick={() => signOut()}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}