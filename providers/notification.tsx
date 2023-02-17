"use client"

import { NotificationsProvider } from '@mantine/notifications'
export default function NotificationRegistry({ children }: { children: React.ReactNode }) {
  return <NotificationsProvider position="top-center" zIndex={2077}>{children}</NotificationsProvider>;
}
