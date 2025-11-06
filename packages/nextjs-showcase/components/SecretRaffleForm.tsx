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
      setTwitterError('请输入推特链接');
      return false;
    }
    if (!url.includes('twitter.com/') && !url.includes('x.com/')) {
      setTwitterError('请输入有效的推特链接（包含 twitter.com/ 或 x.com/）');
      return false;
    }
    setTwitterError('');
    return true;
  };

  // Validate number
  const validateNumber = (num: string): boolean => {
    if (!num.trim()) {
      setNumberError('请输入数字');
      return false;
    }
    const numValue = parseInt(num);
    if (isNaN(numValue)) {
      setNumberError('请输入有效的数字');
      return false;
    }
    if (numValue < 0) {
      setNumberError('数字不能小于 0');
      return false;
    }
    if (numValue > 10000) {
      setNumberError('数字不能大于 10000');
      return false;
    }
    if (!Number.isInteger(numValue)) {
      setNumberError('请输入整数');
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
    onMessage('正在加密你的猜测...');

    try {
      // Check if contract is ready
      if (!contract || !isContractReady) {
        throw new Error('合约未准备好，请稍候');
      }

      // Step 1: Encrypt the guess number
      const numValue = parseInt(guessNumber);
      console.log('🔐 加密数字:', numValue);
      
      const encryptedData = await encrypt(contractAddress, account, numValue);
      console.log('✅ 加密完成:', encryptedData);
      onMessage('正在提交到区块链...');

      // Step 2: Submit to contract
      // encryptedData has structure { encryptedData, proof }
      const tx = await contract.submitGuess(encryptedData.encryptedData, encryptedData.proof);
      console.log('📤 交易已发送:', tx.hash);
      onMessage('等待交易确认...');

      const receipt = await tx.wait();
      console.log('✅ 交易已确认:', receipt.hash);
      onMessage('正在获取结果...');

      // Step 3: Get encrypted result
      const encryptedResult = await contract.getMyResult(account);
      console.log('📥 获取到加密结果:', encryptedResult);
      onMessage('正在解密结果...');

      // Step 4: Get provider and signer for decryption
      const provider = new (await import('ethers')).ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Step 5: Decrypt result (this is an ebool)
      const decryptedResult = await decrypt(encryptedResult, contractAddress, signer);
      console.log('🔓 解密结果:', decryptedResult);

      // Step 6: Show result
      if (decryptedResult === true || decryptedResult === 1 || decryptedResult === '1') {
        setResult('correct');
        onMessage('🎉 恭喜！猜对了！');
      } else {
        setResult('incorrect');
        onMessage('❌ 猜错了，再试一次');
      }

    } catch (error: any) {
      console.error('❌ 提交失败:', error);
      
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        onMessage('交易被取消');
      } else if (error.message?.includes('user rejected')) {
        onMessage('交易被拒绝');
      } else if (error.message?.includes('insufficient funds')) {
        onMessage('余额不足，请确保有足够的 Sepolia ETH');
      } else {
        onMessage(`错误: ${error.message || '未知错误'}`);
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">开始猜数字</h2>
            <p className="text-gray-600 dark:text-gray-400">猜测范围：0 - 10000</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Twitter URL Input */}
            <div>
              <label htmlFor="twitterUrl" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                推特个人主页 <span className="text-red-500">*</span>
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
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">请输入包含 twitter.com/ 或 x.com/ 的链接</p>
            </div>

            {/* Number Input */}
            <div>
              <label htmlFor="guessNumber" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                你的幸运数字 <span className="text-red-500">*</span>
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
                placeholder="输入 0-10000 之间的数字"
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
                💡 你的猜测会被加密，只有你能看到
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
                  <span>处理中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>提交猜测</span>
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
                <p className="text-sm text-indigo-900 dark:text-indigo-200 font-semibold mb-1">🔒 隐私保护</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  你的猜测数字会被<span className="text-indigo-600 dark:text-indigo-400 font-semibold">全同态加密（FHE）</span>技术加密后提交到区块链。
                  即使是合约创建者也无法看到你猜了什么数字，只有你本人可以解密查看结果。
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
              <h2 className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400">🎉 恭喜你！</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">你猜对了幸运数字！</p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">❌ 很遗憾</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">猜错了，再试一次吧！</p>
            </>
          )}

          <button
            onClick={handleReset}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-sm transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            再来一次
          </button>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              你猜的数字: <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{guessNumber}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

