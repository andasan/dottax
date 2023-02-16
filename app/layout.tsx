/* eslint-disable @next/next/no-head-element */
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
          <QueryClientRegistry>
            {auth ? <>{children}</> : <Layout>{children}</Layout>}
          </QueryClientRegistry>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
