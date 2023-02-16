/* eslint-disable @next/next/no-head-element */
import NotificationRegistry from './notification';
import RootStyleRegistry from './emotion';
import QueryClientRegistry from './query';
import Layout from '@/components/layout';

import '@/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const auth = true;
  return (
    <html lang="en-US">
      <head />
      <body>
        <RootStyleRegistry>
          <NotificationRegistry>
            <QueryClientRegistry>
              {auth ? <>{children}</> : <Layout>{children}</Layout>}
            </QueryClientRegistry>
          </NotificationRegistry>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
