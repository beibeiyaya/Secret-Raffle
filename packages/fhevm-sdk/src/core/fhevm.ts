/**
 * Universal FHEVM Core - Environment-Aware SDK
 * Supports both browser and Node.js environments
 * Preserves all existing browser functionality
 */

let fheInstance: any = null;

/**
 * Initialize FHEVM instance for browser environment
 */
async function initializeBrowserFheInstance() {
  console.log('🔍 Checking FHEVM initialization requirements...');
  console.log('- window exists:', typeof window !== 'undefined');
  console.log('- window.ethereum exists:', typeof window !== 'undefined' && !!window.ethereum);
  
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not found. Please install MetaMask or connect a wallet.');
  }

  // Check for both uppercase and lowercase versions of RelayerSDK
  let sdk = (window as any).RelayerSDK || (window as any).relayerSDK;
  console.log('- RelayerSDK available:', !!sdk);
  
  if (!sdk) {
    throw new Error('RelayerSDK not loaded. Please include the script tag in your HTML:\n<script src="https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs"></script>');
  }

  console.log('🔍 Step 1: Checking if already initialized...');
  console.log('🔍 Current fheInstance:', fheInstance);
  
  // Prevent multiple initializations
  if (fheInstance) {
    console.log('⚠️ FHEVM already initialized, returning existing instance');
    return fheInstance;
  }
  
  const { initSDK, createInstance } = sdk;

  // Initialize SDK (load WASM)
  console.log('🔍 Step 2: Initializing SDK (loading WASM)...');
  try {
    await initSDK();
    console.log('✅ SDK initialized (WASM loaded)');
  } catch (error) {
    console.error('❌ SDK initialization failed:', error);
    throw error;
  }
  
  // FHEVM v0.9 Sepolia configuration - ALL 7 required parameters
  const config = {
    chainId: 11155111,
    network: window.ethereum,
    aclContractAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D',
    kmsContractAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A',
    inputVerifierContractAddress: '0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0',
    verifyingContractAddressDecryption: '0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478',
    verifyingContractAddressInputVerification: '0x483b9dE06E4E4C7D35CCf5837A1668487406D955',
    gatewayChainId: 10901,
    relayerUrl: 'https://relayer.testnet.zama.org',
  };
  
  console.log('🔍 Step 3: Creating FHEVM instance with config:', config);
  
  try {
    fheInstance = await createInstance(config);
    console.log('✅ FHEVM instance created successfully:', fheInstance);
    return fheInstance;
  } catch (err) {
    console.error('❌ createInstance failed with error:', err);
    console.error('❌ Error type:', typeof err);
    console.error('❌ Error message:', err?.message);
    console.error('❌ Error stack:', err?.stack);
    throw err;
  }
}

/**
 * Initialize FHEVM instance for Node.js environment
 * REAL FUNCTIONALITY - uses actual RelayerSDK
 */
async function initializeNodeFheInstance(rpcUrl?: string) {
  try {
    console.log('🚀 Initializing REAL FHEVM Node.js instance (v0.9)...');
    
    // Use eval to prevent webpack from analyzing these imports
    const relayerSDKModule = await eval('import("@zama-fhe/relayer-sdk/node")');
    const { createInstance, generateKeypair } = relayerSDKModule;
    
    // Create an EIP-1193 compatible provider for Node.js
    const ethersModule = await eval('import("ethers")');
    const provider = new ethersModule.ethers.JsonRpcProvider(rpcUrl || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
    
    // Create EIP-1193 provider wrapper
    const eip1193Provider = {
      request: async ({ method, params }: { method: string; params: any[] }) => {
        switch (method) {
          case 'eth_chainId':
            return '0xaa36a7'; // Sepolia chain ID
          case 'eth_accounts':
            return ['---YOUR-ADDRESS-HERE---'];
          case 'eth_requestAccounts':
            return ['---YOUR-ADDRESS-HERE---'];
          case 'eth_call':
            // Use the real provider for blockchain calls
            return await provider.call(params[0]);
          case 'eth_sendTransaction':
            // Use the real provider for transactions
            return await provider.broadcastTransaction(params[0]);
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      },
      on: () => {},
      removeListener: () => {}
    };
    
    // FHEVM v0.9 Sepolia configuration for Node.js
    const config = {
      chainId: 11155111,
      network: eip1193Provider,
      aclContractAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D',
      kmsContractAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A',
      inputVerifierContractAddress: '0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0',
      verifyingContractAddressDecryption: '0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478',
      verifyingContractAddressInputVerification: '0x483b9dE06E4E4C7D35CCf5837A1668487406D955',
      gatewayChainId: 10901,
      relayerUrl: 'https://relayer.testnet.zama.org',
    };
    
    fheInstance = await createInstance(config);
    console.log('✅ REAL FHEVM Node.js instance created successfully!');
    return fheInstance;
  } catch (err) {
    console.error('FHEVM Node.js instance creation failed:', err);
    throw err;
  }
}

/**
 * Initialize FHEVM instance - Environment-aware
 * MAINTAINS BACKWARD COMPATIBILITY
 */
export async function initializeFheInstance(options?: { rpcUrl?: string }) {
  // Detect environment
  if (typeof window !== 'undefined' && window.ethereum) {
    // Browser environment - use existing working code
    return initializeBrowserFheInstance();
  } else {
    // Node.js environment - use new functionality
    return initializeNodeFheInstance(options?.rpcUrl);
  }
}

export function getFheInstance() {
  return fheInstance;
}

/**
 * Decrypt a single encrypted value using EIP-712 user decryption (matches showcase API)
 */
export async function decryptValue(encryptedBytes: string, contractAddress: string, signer: any): Promise<number> {
  const fhe = getFheInstance();
  if (!fhe) throw new Error('FHE instance not initialized. Call initializeFheInstance() first.');

  try {
    console.log('🔐 Using EIP-712 user decryption for handle:', encryptedBytes);
    
    // Use EIP-712 user decryption instead of public decryption
    const keypair = fhe.generateKeypair();
    const handleContractPairs = [
      {
        handle: encryptedBytes,
        contractAddress: contractAddress,
      },
    ];
    
    const startTimeStamp = Math.floor(Date.now() / 1000).toString();
    const durationDays = "10";
    const contractAddresses = [contractAddress];

    const eip712 = fhe.createEIP712(
      keypair.publicKey,
      contractAddresses,
      startTimeStamp,
      durationDays
    );

    const signature = await signer.signTypedData(
      eip712.domain,
      {
        UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
      },
      eip712.message
    );

    const result = await fhe.userDecrypt(
      handleContractPairs,
      keypair.privateKey,
      keypair.publicKey,
      signature.replace("0x", ""),
      contractAddresses,
      await signer.getAddress(),
      startTimeStamp,
      durationDays
    );

    return Number(result[encryptedBytes]);
  } catch (error: any) {
    // Check for relayer/network error
    if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
      throw new Error('Decryption service is temporarily unavailable. Please try again later.');
    }
    throw error;
  }
}

/**
 * Batch decrypt multiple encrypted values using EIP-712 user decryption
 */
export async function batchDecryptValues(
  handles: string[], 
  contractAddress: string, 
  signer: any
): Promise<Record<string, number>> {
  const fhe = getFheInstance();
  if (!fhe) throw new Error('FHE instance not initialized. Call initializeFheInstance() first.');

  try {
    console.log('🔐 Using EIP-712 batch user decryption for handles:', handles);
    
    const keypair = fhe.generateKeypair();
    const handleContractPairs = handles.map(handle => ({
      handle,
      contractAddress: contractAddress,
    }));
    
    const startTimeStamp = Math.floor(Date.now() / 1000).toString();
    const durationDays = "10";
    const contractAddresses = [contractAddress];

    const eip712 = fhe.createEIP712(
      keypair.publicKey,
      contractAddresses,
      startTimeStamp,
      durationDays
    );

    const signature = await signer.signTypedData(
      eip712.domain,
      {
        UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
      },
      eip712.message
    );

    const result = await fhe.userDecrypt(
      handleContractPairs,
      keypair.privateKey,
      keypair.publicKey,
      signature.replace("0x", ""),
      contractAddresses,
      await signer.getAddress(),
      startTimeStamp,
      durationDays
    );

    // Convert result to numbers
    const decryptedValues: Record<string, number> = {};
    for (const handle of handles) {
      decryptedValues[handle] = Number(result[handle]);
    }

    return decryptedValues;
  } catch (error: any) {
    if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
      throw new Error('Decryption service is temporarily unavailable. Please try again later.');
    }
    throw error;
  }
}

/**
 * Encrypt values using FHEVM
 * 
 * 📝 BIT SIZE SUPPORT:
 * FHEVM supports different bit sizes for encrypted values. If your contract uses a different bit size
 * than the default 32-bit, you can use the appropriate method:
 * - add8(value)   - for 8-bit values (0-255)
 * - add16(value) - for 16-bit values (0-65535) 
 * - add32(value) - for 32-bit values (0-4294967295) - DEFAULT
 * - add64(value) - for 64-bit values (0-18446744073709551615)
 * - add128(value) - for 128-bit values
 * - add256(value) - for 256-bit values
 * 
 * Example: If your contract expects 8-bit values, replace add32() with add8()
 */
export async function encryptValue(
  contractAddress: string,
  address: string,
  plainDigits: number[]
) {
  const relayer = getFheInstance();
  if (!relayer) throw new Error("FHEVM not initialized");

  const inputHandle = relayer.createEncryptedInput(contractAddress, address);
  for (const d of plainDigits) {
    inputHandle.add8(d);
  }
  
  const ciphertextBlob = await inputHandle.encrypt();
  return ciphertextBlob;
}

/**
 * Helper function to convert Uint8Array to hex string
 */
function toHexString(bytes: Uint8Array | string): string {
  if (typeof bytes === 'string') {
    return bytes.startsWith('0x') ? bytes : '0x' + bytes;
  }
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create encrypted input for contract interaction (matches showcase API)
 */
export async function createEncryptedInput(contractAddress: string, userAddress: string, value: number) {
  const fhe = getFheInstance();
  if (!fhe) throw new Error('FHE instance not initialized. Call initializeFheInstance() first.');

  console.log(`🔐 Creating encrypted input for contract ${contractAddress}, user ${userAddress}, value ${value}`);
  
  const inputHandle = fhe.createEncryptedInput(contractAddress, userAddress);
  inputHandle.add32(value);
  const result = await inputHandle.encrypt();
  
  console.log('✅ Encrypted input created successfully');
  console.log('🔍 Result structure:', result);
  console.log('🔍 Result keys:', Object.keys(result));
  
  // FHEVM v0.9: SDK returns { handles: [bytes32], inputProof: bytes }
  // IMPORTANT: Return as-is, DO NOT convert!
  if (result && typeof result === 'object') {
    // v0.9 format: handles array + inputProof
    if (result.handles && Array.isArray(result.handles) && result.handles.length > 0) {
      console.log('📦 Returning encrypted data directly from SDK (no conversion)');
      console.log('📦 handles[0]:', result.handles[0]);
      console.log('📦 inputProof type:', typeof result.inputProof);
      
      // Return directly without any conversion
      return {
        encryptedData: result.handles[0],
        proof: result.inputProof
      };
    }
    // Fallback: log structure
    else {
      console.error('❌ Unknown encrypted result structure. Properties:', Object.keys(result));
      console.error('❌ Full result:', result);
      throw new Error('Unknown encrypted result structure. Expected { handles: [...], inputProof: ... }');
    }
  }
  
  throw new Error('Invalid encryption result: expected object, got ' + typeof result);
}

/**
 * Public decryption for handles that don't require user authentication
 */
export async function publicDecrypt(encryptedBytes: string): Promise<number> {
  const fhe = getFheInstance();
  if (!fhe) throw new Error('FHE instance not initialized. Call initializeFheInstance() first.');

  try {
    let handle = encryptedBytes;
    if (typeof handle === "string" && handle.startsWith("0x") && handle.length === 66) {
      const values = await fhe.publicDecrypt([handle]);
      return Number(values[handle]);
    } else {
      throw new Error('Invalid ciphertext handle for decryption');
    }
  } catch (error: any) {
    if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
      throw new Error('Decryption service is temporarily unavailable. Please try again later.');
    }
    throw error;
  }
}
