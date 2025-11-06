'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useContract, useEncrypt, useDecrypt } from '@fhevm-sdk';

// SecretRaffle ABI (only the functions we need)
const SECRET_RAFFLE_ABI = [
  "function submitGuess(bytes32 encryptedGuess, bytes calldata proof) external",
  "function getMyResult(address user) external view returns (bytes32)",
  "function isGameReady() external pure returns (bool)",
  "function owner() external view returns (address)"
];

interface SecretRaffleFormProps {
  contractAddress: string;
  account: string;
  onMessage: (message: string) => void;
}

export default function SecretRaffleForm({ contractAddress, account, onMessage }: SecretRaffleFormProps) {
  // Form state
  const [twitterUrl, setTwitterUrl] = useState('');
  const [guessNumber, setGuessNumber] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  
  // Validation errors
  const [twitterError, setTwitterError] = useState('');
  const [numberError, setNumberError] = useState('');

  // FHEVM hooks
  const { contract, isReady: isContractReady } = useContract(contractAddress, SECRET_RAFFLE_ABI);
  const { encrypt, isEncrypting, error: encryptError } = useEncrypt();
  const { decrypt, isDecrypting, error: decryptError } = useDecrypt();

  // Validate Twitter URL
  const validateTwitterUrl = (url: string): boolean => {
    if (!url.trim()) {
      setTwitterError('Please enter Twitter URL');
      return false;
    }
    if (!url.includes('twitter.com/') && !url.includes('x.com/')) {
      setTwitterError('Please enter a valid Twitter URL (containing twitter.com/ or x.com/)');
      return false;
    }
    setTwitterError('');
    return true;
  };

  // Validate number
  const validateNumber = (num: string): boolean => {
    if (!num.trim()) {
      setNumberError('Please enter a number');
      return false;
    }
    const numValue = parseInt(num);
    if (isNaN(numValue)) {
      setNumberError('Please enter a valid number');
      return false;
    }
    if (numValue < 0) {
      setNumberError('Number cannot be less than 0');
      return false;
    }
    if (numValue > 10000) {
      setNumberError('Number cannot exceed 10000');
      return false;
    }
    if (!Number.isInteger(numValue)) {
      setNumberError('Please enter an integer');
      return false;
    }
    setNumberError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset result
    setResult(null);
    
    // Validate inputs
    const isTwitterValid = validateTwitterUrl(twitterUrl);
    const isNumberValid = validateNumber(guessNumber);
    
    if (!isTwitterValid || !isNumberValid) {
      return;
    }

    setIsSubmitting(true);
    onMessage('Encrypting your guess...');

    try {
      // Check if contract is ready
      if (!contract || !isContractReady) {
        throw new Error('Contract not ready, please wait');
      }

      // Step 1: Encrypt the guess number
      const numValue = parseInt(guessNumber);
      console.log('🔐 Encrypting number:', numValue);
      
      const encryptedData = await encrypt(contractAddress, account, numValue);
      console.log('✅ Encryption complete:', encryptedData);
      onMessage('Submitting to blockchain...');

      // Step 2: Submit to contract
      // encryptedData has structure { encryptedData, proof }
      const tx = await contract.submitGuess(encryptedData.encryptedData, encryptedData.proof);
      console.log('📤 Transaction sent:', tx.hash);
      onMessage('Waiting for confirmation...');

      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.hash);
      onMessage('Getting result...');

      // Step 3: Get encrypted result
      const encryptedResult = await contract.getMyResult(account);
      console.log('📥 Encrypted result received:', encryptedResult);
      onMessage('Decrypting result...');

      // Step 4: Get provider and signer for decryption
      if (!window.ethereum) {
        throw new Error('No Ethereum provider found');
      }
      const provider = new (await import('ethers')).ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Step 5: Decrypt result (this is an ebool)
      const decryptedResult = await decrypt(encryptedResult, contractAddress, signer);
      console.log('🔓 Decryption result:', decryptedResult);

      // Step 6: Show result
      // Convert result to boolean - handle various return types
      const resultValue = decryptedResult as any;
      const isCorrect = resultValue === true || resultValue === 1 || resultValue === '1' || String(resultValue) === 'true';
      
      if (isCorrect) {
        setResult('correct');
        onMessage('🎉 Congratulations! You guessed it!');
      } else {
        setResult('incorrect');
        onMessage('❌ Wrong guess, try again');
      }

    } catch (error: any) {
      console.error('❌ Submission failed:', error);
      
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        onMessage('Transaction cancelled');
      } else if (error.message?.includes('user rejected')) {
        onMessage('Transaction rejected');
      } else if (error.message?.includes('insufficient funds')) {
        onMessage('Insufficient funds, please ensure you have enough Sepolia ETH');
      } else {
        onMessage(`Error: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setTwitterUrl('');
    setGuessNumber('');
    setResult(null);
    setTwitterError('');
    setNumberError('');
    onMessage('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
      {result === null ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Start Guessing</h2>
            <p className="text-gray-600 dark:text-gray-400">Guess Range: 0 - 10000</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Twitter URL Input */}
            <div>
              <label htmlFor="twitterUrl" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Twitter Profile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="twitterUrl"
                value={twitterUrl}
                onChange={(e) => {
                  setTwitterUrl(e.target.value);
                  if (twitterError) validateTwitterUrl(e.target.value);
                }}
                onBlur={(e) => validateTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/yourname"
                className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${twitterError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                disabled={isSubmitting}
              />
              {twitterError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{twitterError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Please enter a URL containing twitter.com/ or x.com/</p>
            </div>

            {/* Number Input */}
            <div>
              <label htmlFor="guessNumber" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Your Lucky Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="guessNumber"
                value={guessNumber}
                onChange={(e) => {
                  setGuessNumber(e.target.value);
                  if (numberError) validateNumber(e.target.value);
                }}
                onBlur={(e) => validateNumber(e.target.value)}
                placeholder="Enter a number between 0-10000"
                min="0"
                max="10000"
                step="1"
                className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${numberError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                disabled={isSubmitting}
              />
              {numberError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{numberError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                💡 Your guess will be encrypted, only you can see it
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !!twitterError || !!numberError}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Submit Guess</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-semibold mb-1">🔒 Privacy Protected</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  Your guessed number will be encrypted using <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Fully Homomorphic Encryption (FHE)</span> technology before being submitted to the blockchain.
                  Even the contract creator cannot see what number you guessed, only you can decrypt and view the result.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          {result === 'correct' ? (
            <>
              <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400">🎉 Congratulations!</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">You guessed the lucky number!</p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">❌ Sorry</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Wrong guess, try again!</p>
            </>
          )}

          <button
            onClick={handleReset}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-sm transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Try Again
          </button>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your guessed number: <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{guessNumber}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
