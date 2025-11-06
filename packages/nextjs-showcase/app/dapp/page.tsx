'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFhevm } from '@fhevm-sdk';
import SecretRaffleForm from '../../components/SecretRaffleForm';

// Contract address (deployed on Sepolia)
const SECRET_RAFFLE_ADDRESS = '0x15eB8FeE645286BA7F15704cF0C991A4cD35cbA2';

export default function DAppPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string>('');

  // Wagmi hooks
  const { address: account, isConnected } = useAccount();
  const chainId = useChainId();
  
  // FHEVM hook
  const { 
    status: fhevmStatus, 
    initialize: initializeFhevm,
    error: fhevmError 
  } = useFhevm();

  // Auto-initialize FHEVM when wallet connects
  useEffect(() => {
    console.log('📊 DApp useEffect triggered:', { 
      isConnected, 
      fhevmStatus, 
      account,
      chainId,
      hasWindowEthereum: typeof window !== 'undefined' && !!window.ethereum 
    });
    
    const initWithRetry = async () => {
      if (isConnected && fhevmStatus === 'idle') {
        console.log('🔄 Attempting FHEVM initialization...');
        
        // Wait a bit for wagmi to fully initialize the provider
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if window.ethereum is available
        if (typeof window !== 'undefined' && window.ethereum) {
          console.log('✅ Provider detected, initializing FHEVM now');
          initializeFhevm();
        } else {
          console.log('⏳ Provider not ready, will retry in 2s...');
          // Retry after another delay
          setTimeout(() => {
            if (window.ethereum) {
              console.log('✅ Provider now available, initializing FHEVM');
              initializeFhevm();
            } else {
              console.error('❌ Provider still not available after 3s total');
              setMessage('Wallet provider not detected. Please try reconnecting your wallet.');
            }
          }, 2000);
        }
      }
    };
    
    initWithRetry();
  }, [isConnected, fhevmStatus, initializeFhevm, account, chainId]);

  // Check if on Sepolia (chainId 11155111)
  const isSepoliaNetwork = chainId === 11155111;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Secret Raffle</span>
            </button>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* FHEVM Status */}
              {fhevmStatus === 'ready' && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">FHEVM Ready</span>
                </div>
              )}
              
              {/* RainbowKit Connect Button */}
              <ConnectButton />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Message Banner */}
        {message && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 rounded-r-lg animate-pulse">
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">{message}</p>
          </div>
        )}

        {/* Network Warning */}
        {isConnected && !isSepoliaNetwork && (
          <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-red-900 dark:text-red-200 mb-2">Wrong Network</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-1">
                  Please switch to <span className="font-semibold">Sepolia Testnet</span> to use this application.
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Current Chain ID: {chainId} · Required: 11155111 (Sepolia)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {!isConnected ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Connect Wallet to Start</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Please connect your wallet to participate in Secret Raffle
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  💡 Make sure your wallet is switched to Sepolia Testnet
                </p>
              </div>
            </div>
          </div>
        ) : fhevmStatus === 'loading' ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <svg className="animate-spin text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Initializing FHEVM...</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait, loading encryption module</p>
            </div>
          </div>
        ) : fhevmStatus === 'error' ? (
          <div className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-sm p-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">FHEVM Initialization Failed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{fhevmError || 'Unknown error'}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm transition-colors"
              >
                Reload Page and Retry
              </button>
            </div>
          </div>
        ) : isSepoliaNetwork ? (
          <SecretRaffleForm 
            contractAddress={SECRET_RAFFLE_ADDRESS}
            account={account!}
            onMessage={setMessage}
          />
        ) : null}

        {/* Contract Info */}
        {isConnected && isSepoliaNetwork && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <span>Contract Address:</span>
              <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-mono rounded">
                {SECRET_RAFFLE_ADDRESS}
              </code>
              <a 
                href={`https://sepolia.etherscan.io/address/${SECRET_RAFFLE_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 underline font-medium"
              >
                View on Etherscan ↗
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
