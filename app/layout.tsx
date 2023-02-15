/* eslint-disable @next/next/no-head-element */
import RootStyleRegistry from './emotion';
import QueryClientRegistry from './query';
import Layout from '@/components/layout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head />
      <body>
        <RootStyleRegistry>
          <QueryClientRegistry>
            <Layout>{children}</Layout>
          </QueryClientRegistry>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
