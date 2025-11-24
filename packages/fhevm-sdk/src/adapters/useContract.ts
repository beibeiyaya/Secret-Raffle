/**
 * Wagmi-integrated hook for contract interactions
 * Uses Wagmi's walletClient instead of window.ethereum
 */

import { useState, useEffect } from 'react';
import { useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

export function useContract(address: string, abi: any[]) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Get walletClient from Wagmi (the RIGHT way)
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (!address || !abi) {
      console.log('⚠️ useContract: Missing address or abi');
      return;
    }

    if (!walletClient) {
      console.log('⏳ useContract: Waiting for walletClient from Wagmi...');
      setIsReady(false);
      return;
    }

    async function setupContract() {
      try {
        console.log('🔧 useContract: Setting up contract with Wagmi walletClient');
        
        // Use Wagmi's walletClient (not window.ethereum)
        const provider = new ethers.BrowserProvider(walletClient as any);
        
        // Get the signer to enable sending transactions
        const signer = await provider.getSigner();
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
  }, [address, abi, walletClient]);

  return {
    contract,
    isReady,
    error,
  };
}
