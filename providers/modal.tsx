"use client"

import { ModalsProvider } from "@mantine/modals";

export default function ModalRegistry({ children }: { children: React.ReactNode }) {
  return <ModalsProvider>{children}</ModalsProvider>;
}
