/**
 * Wagmi-like hook for contract interactions
 */

import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

export function useContract(address: string, abi: any[]) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>('');
  const retryCountRef = useRef(0);
  const maxRetries = 10; // Maximum 10 retries (5 seconds total)

  useEffect(() => {
    if (!address || !abi) {
      console.log('⚠️ useContract: Missing address or abi');
      return;
    }

    let timeoutId: NodeJS.Timeout;

    async function setupContract() {
      try {
        console.log('🔧 useContract: Setting up contract... (attempt', retryCountRef.current + 1, ')');
        
        // Check if window.ethereum is available
        if (typeof window === 'undefined' || !window.ethereum) {
          if (retryCountRef.current < maxRetries) {
            console.log('⏳ useContract: window.ethereum not available yet, retrying in 500ms...');
            retryCountRef.current++;
            timeoutId = setTimeout(setupContract, 500);
            return;
          } else {
            throw new Error('Wallet provider not detected after multiple retries');
          }
        }

        console.log('✅ useContract: window.ethereum detected');
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Get the signer to enable sending transactions
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log('✅ useContract: Signer obtained:', signerAddress);
        
        // Create contract instance with signer
        const contractInstance = new ethers.Contract(address, abi, signer);
        
        setContract(contractInstance);
        setIsReady(true);
        setError('');
        retryCountRef.current = 0; // Reset retry count on success
        console.log('✅ useContract: Contract ready at', address);
      } catch (err) {
        console.error('❌ useContract: Setup failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Contract setup failed';
        setError(errorMessage);
        setIsReady(false);
        
        // Retry on certain errors
        if (retryCountRef.current < maxRetries && errorMessage.includes('could not detect network')) {
          console.log('⏳ useContract: Network detection failed, retrying in 500ms...');
          retryCountRef.current++;
          timeoutId = setTimeout(setupContract, 500);
        }
      }
    }

    setupContract();

    // Cleanup function to clear timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [address, abi]);

  return {
    contract,
    isReady,
    error,
  };
}
