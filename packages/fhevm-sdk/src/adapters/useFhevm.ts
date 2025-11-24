/**
 * Wagmi-integrated hook for FHEVM instance
 */

import { useState, useCallback, useRef } from 'react';
import { initializeFheInstance } from '../core/index';

interface UseFhevmProps {
  provider?: any; // EIP-1193 provider from wagmi walletClient
}

export function useFhevm(props?: UseFhevmProps) {
  const [instance, setInstance] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const isInitializingRef = useRef(false);

  const initialize = useCallback(async (provider?: any) => {
    // Use provider from parameter or props
    const networkProvider = provider || props?.provider;
    
    // Prevent multiple simultaneous initializations
    if (isInitializingRef.current || status === 'loading' || status === 'ready') {
      console.log('⚠️ FHEVM initialization already in progress or completed, skipping');
      return;
    }
    
    if (!networkProvider) {
      const errorMsg = 'No provider available. Please connect your wallet first.';
      setError(errorMsg);
      setStatus('error');
      console.error('❌ FHEVM hook:', errorMsg);
      return;
    }
    
    isInitializingRef.current = true;
    setStatus('loading');
    setError('');
    
    console.log('🚀 Starting FHEVM initialization with provider...');
    
    try {
      const fheInstance = await initializeFheInstance({ provider: networkProvider });
      setInstance(fheInstance);
      setStatus('ready');
      console.log('✅ FHEVM hook: initialized successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setStatus('error');
      console.error('❌ FHEVM hook: initialization failed:', err);
      isInitializingRef.current = false; // Reset on error to allow retry
    }
  }, [status, props?.provider]);

  return {
    instance,
    status,
    error,
    initialize,
    isInitialized: status === 'ready',
  };
}
