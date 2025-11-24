/**
 * Wagmi-like hook for FHEVM instance
 */

import { useState, useCallback, useRef } from 'react';
import { initializeFheInstance } from '../core/index';

export function useFhevm() {
  const [instance, setInstance] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const isInitializingRef = useRef(false);

  const initialize = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (isInitializingRef.current || status === 'loading' || status === 'ready') {
      console.log('⚠️ FHEVM initialization already in progress or completed, skipping');
      return;
    }
    
    isInitializingRef.current = true;
    setStatus('loading');
    setError('');
    
    console.log('🚀 Starting FHEVM initialization...');
    
    try {
      const fheInstance = await initializeFheInstance();
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
  }, [status]);

  return {
    instance,
    status,
    error,
    initialize,
    isInitialized: status === 'ready',
  };
}
