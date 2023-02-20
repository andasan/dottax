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
      <head />
      <body>
        <RootStyleRegistry>
          <NotificationRegistry>
            <ReduxRegistry>
              <QueryClientRegistry>
                <ModalRegistry>
                  <AuthSessionRegistry>{children}</AuthSessionRegistry>
                </ModalRegistry>
              </QueryClientRegistry>
            </ReduxRegistry>
          </NotificationRegistry>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
