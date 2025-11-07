'use client';

import dynamic from 'next/dynamic';

// 动态导入 Providers，禁用 SSR
const Providers = dynamic(
  () => import('./Providers').then((mod) => mod.Providers),
  { ssr: false }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}

