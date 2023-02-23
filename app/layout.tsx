/* eslint-disable @next/next/no-head-element */
import {
  AuthSessionRegistry,
  NotificationRegistry,
  RootStyleRegistry,
  QueryClientRegistry,
  ReduxRegistry,
  ModalRegistry,
} from '@/providers';

import '@/styles/globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" /> */}
        <title>Dottax</title>
      </head>
      <body>
        <RootStyleRegistry>
          <AuthSessionRegistry>{children}</AuthSessionRegistry>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
