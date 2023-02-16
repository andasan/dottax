"use client";

import { AppShell, Navbar, useMantineTheme } from '@mantine/core'
import { useState } from 'react'

import FooterBar from './Footer/Footer'
import HeaderBar from './Header/Header'
import NavigationBar from './Navbar/Navbar'

type LayoutType = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutType) {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(true)
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
      navbarOffsetBreakpoint="lg"
      navbar={
          <NavigationBar />
      }
      footer={<FooterBar />}
      header={<HeaderBar opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  )
}
