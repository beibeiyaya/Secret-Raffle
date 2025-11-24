/**
 * Hook for contract interactions
 * Accepts a provider/walletClient as parameter (pass from Wagmi in your app)
 */

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface UseContractProps {
  address: string;
  abi: any[];
  provider?: any; // EIP-1193 provider or Wagmi walletClient
}

export function useContract({ address, abi, provider }: UseContractProps) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!address || !abi) {
      console.log('⚠️ useContract: Missing address or abi');
      return;
    }

    if (!provider) {
      console.log('⏳ useContract: Waiting for provider...');
      setIsReady(false);
      return;
    }

    async function setupContract() {
      try {
        console.log('🔧 useContract: Setting up contract with provider');
        
        // Create provider from walletClient or window.ethereum
        const ethersProvider = new ethers.BrowserProvider(provider);
        
        // Get the signer to enable sending transactions
        const signer = await ethersProvider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log('✅ useContract: Signer obtained:', signerAddress);
        
        // Create contract instance with signer
        const contractInstance = new ethers.Contract(address, abi, signer);
        
        setContract(contractInstance);
        setIsReady(true);
        setError('');
        console.log('✅ useContract: Contract ready at', address);
      } catch (err) {
        console.error('❌ useContract: Setup failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Contract setup failed';
        setError(errorMessage);
        setIsReady(false);
      }
    }

    setupContract();
  }, [address, abi, provider]);

  return {
    contract,
    isReady,
    error,
  };
}
