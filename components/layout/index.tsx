"use client";

import { Student } from '@/types/schema.types';
import { AppShell, useMantineTheme } from '@mantine/core'
import { useState, useEffect } from 'react'

import { useStoreDispatch } from '@/lib/hooks';
import { studentAction } from '@/store/index';

import FooterBar from '@/components/layout/footer'
import HeaderBar from '@/components/layout/header'
import NavigationBar from '@/components/layout/navbar/navigation-bar';

type LayoutType = {
  children: React.ReactNode,
  students: Student[]
}

export default function Layout({ children, students }: LayoutType) {
  const dispatch = useStoreDispatch();

  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    dispatch(studentAction.loadStudents(students));
    dispatch(studentAction.loadBatches(students));
  }, [students, dispatch]);

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
