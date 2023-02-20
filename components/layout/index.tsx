"use client";

import { AppShell, Navbar, useMantineTheme } from '@mantine/core'
import { useState } from 'react'

import FooterBar from './footer/Footer'
import HeaderBar from './header/Header'
import NavigationBar from './navbar/navbar';

type LayoutType = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutType) {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
        }
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
          < NavigationBar opened={opened} />
      }
      footer={<FooterBar />}
      header={<HeaderBar opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  )
}
