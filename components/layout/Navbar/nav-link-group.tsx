"use client"

import {
  Box,
  Collapse,
  createStyles,
  Group,
  ThemeIcon,
  UnstyledButton
} from '@mantine/core'
import { IconChevronLeft, IconChevronRight, IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import Link from 'next/link'

import type { NavLinkType } from '@/types/component.types'

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    }
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black
    },
  },

  chevron: {
    transition: 'transform 200ms ease'
  },

  prompt: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? 'transparent'
        : theme.white,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.blue[3],

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.blue[7]
          : theme.colors.blue[7],
      color: theme.colorScheme === 'dark' ? theme.white : theme.colors.blue[0]
    },
  }
}))

export default function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link
}: NavLinkType) {
  const { classes, theme } = useStyles()
  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft
  const nonNestedLinks = link && link
  const items = (hasLinks ? links : []).map((elLink) => (
    <UnstyledButton
      component={Link}
      className={classes.link}
      href={elLink.link}
      key={elLink.label}
    >
      {elLink.label}
    </UnstyledButton>
  ))

  //unstyled button to add a student
  const addBatch = (
    <UnstyledButton
      component={Link}
      className={`${classes.link} ${classes.prompt}`}
      href="/add-batch"
      key="add-batch"
    >
      <Group
        position="apart"
        spacing={0}

      >
      Add a Batch
      <IconPlus
        size={14}
      />

      </Group>
    </UnstyledButton>
  )

  return (
    <>
      <UnstyledButton
        // @ts-ignore
        component={link ? Link : 'a'}
        href={nonNestedLinks}
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>

            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                  : 'none'
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks && label === 'Students' ? <Collapse in={opened}>{addBatch}</Collapse> : null}
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}

type NavbarLinkGroupType = {
  data: NavLinkType
}

export function NavbarLinksGroup({ data }: NavbarLinkGroupType) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: 220,
        padding: theme.spacing.md,
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white
      })}
    >
      <LinksGroup {...data} />
    </Box>
  )
}
