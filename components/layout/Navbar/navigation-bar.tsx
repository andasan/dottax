import { createStyles, Navbar, ScrollArea, Skeleton } from '@mantine/core';

import { navData } from '@/data/navData';
import { useStoreSelector } from '@/lib/hooks';
import { studentState } from '@/store/index';

import LinksGroup from './nav-link-group';
import { UserButton } from './user-button';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: '0 !important',
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

interface NavigationBarProps {
  opened: boolean;
}

export default function NavigationBar({ opened }: NavigationBarProps) {
  const { loading, batches } = useStoreSelector(studentState);
  const { classes } = useStyles();

  const links = navData(batches).map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Navbar width={{ sm: 300 }} hidden={opened} p="md" className={classes.navbar}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        {loading ? (
          <Skeleton height={40} radius="sm" />
        ) : (
          <div className={classes.linksInner}>{links}</div>
        )}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton />
      </Navbar.Section>
    </Navbar>
  );
}