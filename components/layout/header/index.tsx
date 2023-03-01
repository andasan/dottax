import {
  createStyles,
  Group,
  Burger,
  Header,
  MediaQuery,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import React from 'react';
import Image from 'next/image';

import CICCCLogo from '@/assets/static/ciccc-logo-square.png';
import { ColorSchemeToggle } from '@/components/common';

import NavAction from '../nav-action/nav-action';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));

type HeaderBarType = {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeaderBar: React.FC<HeaderBarType> = ({ opened, setOpened }) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Header height={60} p="xs" className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={!opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[7]}
              mx="md"
            />
          </MediaQuery>
          <Image
            style={{
              mixBlendMode: colorScheme === 'light' ? 'darken' : 'exclusion',
            }}
            height={28}
            width={28}
            src={CICCCLogo.src}
            alt="CICCC Logo"
          />
        </Group>

        <Group>
          <ColorSchemeToggle />
        </Group>
      </div>
    </Header>
  );
};

export default HeaderBar;
