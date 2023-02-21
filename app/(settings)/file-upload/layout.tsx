/* eslint-disable @next/next/no-head-element */
import Layout from '@/components/layout';

import '@/styles/globals.css';

export default function FileUploadLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
