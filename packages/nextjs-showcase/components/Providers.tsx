'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  rainbowWallet, 
  walletConnectWallet,
  // 移除与 FHEVM CORS 冲突的钱包
  // coinbaseWallet,
  // baseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// 自定义钱包连接器，移除冲突的钱包
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'Secret Raffle',
    projectId: 'YOUR_PROJECT_ID',
  }
);

const config = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: false,
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
