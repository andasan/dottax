/* eslint-disable @next/next/no-head-element */
import { AuthSessionRegistry, NotificationRegistry, RootStyleRegistry, QueryClientRegistry } from '@/providers';

import '@/styles/globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en-US">
      <head />
      <body>
        <RootStyleRegistry>
          <NotificationRegistry>
            <QueryClientRegistry>
              <AuthSessionRegistry>{children}</AuthSessionRegistry>
            </QueryClientRegistry>
          </NotificationRegistry>
        </RootStyleRegistry>
      </body>
    </html>
  );
}