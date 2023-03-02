"use client";

import { AppShell, useMantineTheme } from '@mantine/core'
import { useState, useEffect } from 'react'

import { Student } from '@/types/component.types';

import FooterBar from '@/components/layout/footer'
import HeaderBar from '@/components/layout/header'
import NavigationBar from '@/components/layout/navbar/navigation-bar';
import { useStudentStore } from '@/lib/zustand';

type LayoutType = {
  children: React.ReactNode,
  students: Student[]
}

export default function Layout({ children, students }: LayoutType) {
  const setStudents = useStudentStore((state) => state.setStudents);
  const fetchBatches = useStudentStore((state) => state.fetchBatches);

  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    setStudents(students);
    fetchBatches();
  }, [])

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
          <NavigationBar opened={opened} />
      }
      footer={<FooterBar />}
      header={<HeaderBar opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  )
}
