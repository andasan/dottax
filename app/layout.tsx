/* eslint-disable @next/next/no-head-element */
import {
  AuthSessionRegistry,
  NotificationRegistry,
  RootStyleRegistry,
  QueryClientRegistry,
  ReduxRegistry,
} from '@/providers';

import '@/styles/globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head />
      <body>
        <RootStyleRegistry>
          <NotificationRegistry>
            <ReduxRegistry>
              <QueryClientRegistry>
                <AuthSessionRegistry>{children}</AuthSessionRegistry>
              </QueryClientRegistry>
            </ReduxRegistry>
          </NotificationRegistry>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
