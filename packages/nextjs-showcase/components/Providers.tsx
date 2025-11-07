'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Secret Raffle',
  projectId: 'YOUR_PROJECT_ID', // 可以从 WalletConnect Cloud 获取
  chains: [sepolia],
  ssr: false, // 禁用 SSR，仅在客户端运行
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  // 如果在服务端环境，直接返回 children（不渲染钱包组件）
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
