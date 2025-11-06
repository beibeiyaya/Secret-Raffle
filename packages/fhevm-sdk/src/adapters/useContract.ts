/**
 * Wagmi-like hook for contract interactions
 */

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useContract(address: string, abi: any[]) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!window.ethereum || !address || !abi) return;

    async function setupContract() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Get the signer to enable sending transactions
        const signer = await provider.getSigner();
        // Create contract instance with signer
        const contractInstance = new ethers.Contract(address, abi, signer);
        setContract(contractInstance);
        setIsReady(true);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Contract setup failed');
        setIsReady(false);
      }
    }

    setupContract();
  }, [address, abi]);

  return {
    contract,
    isReady,
    error,
  };
}
