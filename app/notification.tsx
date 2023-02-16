"use client"

import { NotificationsProvider } from '@mantine/notifications'
export default function NotificationRegistry({ children }: { children: React.ReactNode }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
