# 🎲 Secret Raffle

> The First Privacy-Preserving Lottery Platform Powered by Fully Homomorphic Encryption

[![Built with FHEVM](https://img.shields.io/badge/Built%20with-FHEVM-blue)](https://docs.zama.ai/fhevm)
[![Ethereum Sepolia](https://img.shields.io/badge/Network-Sepolia-purple)](https://sepolia.etherscan.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Secret Raffle** is a decentralized lottery platform that combines Web3 blockchain transparency with Web2 social media reach, ensuring fairness through on-chain computation while protecting user privacy using Zama's Fully Homomorphic Encryption (FHE) technology.

---

## 🌟 Why Secret Raffle?

### The Problem with Traditional Lotteries

Traditional Web2 lottery platforms suffer from three critical issues:

| Problem | Impact |
|---------|--------|
| **🎭 Black Box Operations** | Centralized control, no way to verify fairness, results can be manipulated |
| **💸 Prize Redemption Issues** | Organizers can refuse payouts, high cost for legal recourse |
| **😴 Limited Engagement** | Only basic actions (follow/retweet), boring and repetitive |

### Our Solution

Secret Raffle leverages blockchain and FHE to solve these problems:

| Feature | Benefit |
|---------|---------|
| **✅ Transparent Mechanism** | All logic on-chain, smart contracts are auditable, results are verifiable |
| **⚡ Instant Prize Distribution** | Prizes pre-deposited, automatic transfer upon winning, no human intervention |
| **🎮 Multiple Game Modes** | Support for lottery, number guessing, predictions, and more |
| **🔒 Privacy Protection** | User data encrypted throughout, only you can decrypt your results |
| **🌐 Social Integration** | Connect Twitter, Telegram, Discord (roadmap) |

---

## 🚀 Current Demo: Number Guessing Game

This technology demonstration showcases the core FHE capabilities:

1. **Connect Wallet**: Link your Web3 wallet (MetaMask, etc.)
2. **Enter Twitter Profile**: Demonstrate Web2 social integration
3. **Guess a Number**: Submit an encrypted number (0-10000)
4. **View Results**: See if you guessed correctly (answer: 1024)

**🔐 The Magic of FHE**: Your guessed number is encrypted on the client, remains encrypted during smart contract comparison, and only you can decrypt the result. Even the contract creator cannot see what you guessed!

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│         (Next.js 14 + Tailwind CSS + TypeScript)    │
└─────────────────┬───────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────┐
│                  FHEVM SDK                          │
│  • Client-side Encryption (fhevmjs)                 │
│  • Keypair Generation                               │
│  • User Decryption via EIP-712 Signature            │
└─────────────────┬───────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────┐
│              Smart Contract Layer                    │
│           (Solidity + @fhevm/solidity)              │
│                                                      │
│  SecretRaffle.sol:                                  │
│  • Encrypted secret number (euint32)                │
│  • Encrypted comparison (FHE.eq)                    │
│  • Access control (FHE.allow)                       │
└─────────────────┬───────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────┐
│            Ethereum Sepolia Testnet                 │
│        (Decentralized Execution Layer)              │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom components
- **Type Safety**: TypeScript
- **Wallet Integration**: Custom wallet connector
- **State Management**: React Hooks

### Smart Contracts
- **Language**: Solidity ^0.8.24
- **FHE Library**: @fhevm/solidity
- **Development**: Hardhat
- **Testing**: Hardhat + Ethers.js
- **Deployment**: Ethereum Sepolia

### FHEVM Integration
- **SDK**: Custom @fhevm-sdk
- **Encryption**: fhevmjs via CDN
- **Relayer**: Zama Relayer Service
- **Key Management**: Client-side ephemeral keypairs

---

## 📦 Project Structure

```
fhevm-react-template/
├── packages/
│   ├── hardhat/                 # Smart contract development
│   │   ├── contracts/
│   │   │   └── SecretRaffle.sol # Core game contract
│   │   ├── deploy/
│   │   │   └── deploy_secret_raffle.ts
│   │   └── test/
│   │       └── SecretRaffle.test.ts
│   │
│   ├── fhevm-sdk/              # Custom FHEVM SDK
│   │   └── src/
│   │       ├── adapters/        # React hooks
│   │       └── core/            # Encryption/decryption
│   │
│   └── nextjs-showcase/        # Frontend application
│       ├── app/
│       │   ├── page.tsx        # Landing page
│       │   ├── dapp/
│       │   │   └── page.tsx    # DApp interface
│       │   └── globals.css
│       └── components/
│           └── SecretRaffleForm.tsx
│
├── PRD.md                      # Product Requirements
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fhevm-react-template

# Install dependencies
pnpm install

# Copy environment variables (if needed)
cp packages/hardhat/.env.example packages/hardhat/.env
```

### Development

#### 1. Smart Contract Development

```bash
# Compile contracts
cd packages/hardhat
pnpm compile

# Run tests
pnpm test

# Deploy to Sepolia (requires .env configuration)
pnpm deploy:sepolia
```

#### 2. Frontend Development

```bash
# Start development server
cd packages/nextjs-showcase
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

### Environment Configuration

Create `packages/hardhat/.env`:

```bash
PRIVATE_KEY=your_private_key_here
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

---

## 🎯 Core Features

### 1. Encrypted Number Comparison

```solidity
// User submits encrypted guess
function submitGuess(
    externalEuint32 encryptedGuess,
    bytes calldata proof
) external {
    // Convert external encrypted input
    euint32 userGuess = FHE.fromExternal(encryptedGuess, proof);
    
    // Perform encrypted comparison
    ebool isCorrect = FHE.eq(userGuess, secretNumber);
    
    // Store encrypted result
    userGuessResults[msg.sender] = isCorrect;
    
    // Grant user decryption permission
    FHE.allow(isCorrect, msg.sender);
}
```

### 2. Privacy-Preserving Decryption

```typescript
// Frontend: User decrypts their own result
const encryptedResult = await contract.getMyResult(userAddress);
const keypair = instance.generateKeypair();
const eip712 = instance.createEIP712(keypair.publicKey, ...);
const signature = await signer.signTypedData(...);
const result = await instance.userDecrypt(
    encryptedResult,
    keypair.privateKey,
    signature,
    ...
);
```

### 3. Input Validation

- **Twitter URL**: Must contain "twitter.com/" or "x.com/"
- **Number Range**: 0-10000 (inclusive)
- **Type Safety**: Integer values only
- **Real-time Feedback**: Immediate error messages

---

## 📱 User Interface

### Landing Page

The landing page features:

- **Hero Section**: Clear value proposition
- **Pain Points**: Problem analysis
- **Solutions**: Feature highlights  
- **How It Works**: Step-by-step guide
- **Demo Notice**: Current version status
- **CTA**: Prominent "Get Started" button

### DApp Interface

The DApp page includes:

- **Wallet Connection**: One-click connect
- **Status Indicators**: FHEVM ready, network check
- **Input Form**: Twitter URL + number guess
- **Real-time Validation**: Instant feedback
- **Result Display**: Success/failure animations
- **Privacy Notice**: FHE explanation
- **Contract Info**: Address + Etherscan link

---

## 🔐 Security & Privacy

### What's Encrypted

✅ User's guessed number  
✅ Comparison result (ebool)  
✅ All intermediate computation states  

### What's Public

- User's wallet address
- Transaction hashes
- Contract deployment address
- Number of submissions (on-chain)

### Access Control

- Only the user can decrypt their own result
- Contract creator cannot see user guesses
- No centralized backend storing plaintext data
- EIP-712 signatures for decryption authorization

---

## 📊 Smart Contract Details

### Contract Address

**Sepolia**: `0x15eB8FeE645286BA7F15704cF0C991A4cD35cbA2`

[View on Etherscan →](https://sepolia.etherscan.io/address/0x15eB8FeE645286BA7F15704cF0C991A4cD35cbA2)

### Contract Functions

| Function | Visibility | Description |
|----------|-----------|-------------|
| `submitGuess` | external | Submit encrypted guess with proof |
| `getMyResult` | public view | Get user's encrypted result handle |
| `isGameReady` | public pure | Check if game is ready (always true) |
| `owner` | public view | Get contract owner address |

### Gas Costs

| Operation | Estimated Gas |
|-----------|--------------|
| Submit Guess | ~200,000 |
| Get Result | ~30,000 |

---

## 🧪 Testing

### Run Contract Tests

```bash
cd packages/hardhat
pnpm test
```

**Test Coverage**:
- ✅ Contract deployment
- ✅ Secret number initialization
- ✅ Guess submission flow
- ✅ Result retrieval
- ✅ Access control
- ✅ Multiple user scenarios

### Manual Testing Checklist

Frontend:
- [ ] Wallet connects successfully
- [ ] FHEVM initializes (green badge)
- [ ] Form validation works
- [ ] Encryption succeeds
- [ ] Transaction confirms
- [ ] Result decrypts correctly
- [ ] "Try Again" resets form
- [ ] Dark mode works

Network:
- [ ] Sepolia network detection
- [ ] Network switch prompt
- [ ] RPC connection stable
- [ ] Etherscan links work

---

## 🚀 Deployment

### Deploy Smart Contract

```bash
cd packages/hardhat
pnpm deploy:sepolia
```

The deployment script will:
1. Deploy `SecretRaffle` contract
2. Initialize secret number to 1024
3. Output contract address
4. (Optional) Verify on Etherscan

### Deploy Frontend

**Recommended Platform**: Vercel

```bash
cd packages/nextjs-showcase

# Build for production
pnpm build

# Deploy to Vercel
vercel --prod
```

**Environment Variables** (Vercel):
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x15eB8FeE645286BA7F15704cF0C991A4cD35cbA2
NEXT_PUBLIC_CHAIN_ID=11155111
```

---

## 🛣️ Roadmap

### Phase 1: Technology Demonstration ✅ (Current)

- [x] Number guessing game
- [x] FHE encrypted comparison
- [x] Client-side decryption
- [x] Sepolia deployment
- [x] Professional UI

### Phase 2: Real Lottery System

- [ ] Prize pool management
- [ ] Random winner selection
- [ ] Automatic ETH/token distribution
- [ ] Multi-tier prize support

### Phase 3: Extended Features

- [ ] Multiple concurrent games
- [ ] Traditional raffle mode
- [ ] Prediction markets
- [ ] Quiz games

### Phase 4: Social Integration

- [ ] Twitter OAuth login
- [ ] Telegram bot
- [ ] Discord integration
- [ ] Cross-platform data sync

### Phase 5: Advanced Features

- [ ] Token/NFT gating
- [ ] VIP tiers
- [ ] Referral system
- [ ] DAO governance

---

## 💡 Key Technical Innovations

### 1. Stateless Contract + Client-Side Decryption

Unlike traditional FHE examples that use `requestDecryption` callbacks, we implement a simpler model:
- Contract only stores encrypted results
- No async decryption on-chain
- Users decrypt their own results client-side
- Reduces complexity and gas costs

### 2. Unified FHEVM Provider

Custom `@fhevm-sdk` package provides:
- React hooks (`useContract`, `useEncrypt`, `useDecrypt`)
- Automatic instance initialization
- Error handling and retry logic
- TypeScript type safety

### 3. Modern UI/UX

- Tailwind CSS for rapid development
- Full dark mode support
- Responsive design (mobile-first)
- Clear status indicators
- Smooth animations

---

## 📚 Learn More

### Zama FHEVM Resources

- **Documentation**: https://docs.zama.ai/fhevm
- **GitHub**: https://github.com/zama-ai/fhevm
- **Discord**: https://discord.com/invite/zama
- **Blog**: https://www.zama.ai/blog

### Related Projects

- **Zama Developer Program**: https://docs.zama.org/programs/developer-program
- **FHEVM Solidity Library**: https://github.com/zama-ai/fhevm-solidity
- **fhevmjs**: https://github.com/zama-ai/fhevmjs

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Standards

- Write tests for new features
- Follow existing code style
- Update documentation
- Add comments for complex logic

---

## 🐛 Known Issues

1. **FHEVM Initialization Delay**: First load may take 5-10 seconds to initialize WASM modules
   - **Workaround**: Show loading indicator, educate users

2. **Gas Costs**: FHE operations are computationally expensive
   - **Impact**: ~200k gas per guess submission
   - **Note**: This is expected for current FHEVM technology

3. **Relayer Dependency**: Decryption requires Zama's relayer service
   - **Mitigation**: Implement retry logic, show clear error messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

**This project is built upon:**

- **[Zama FHEVM React Template](https://github.com/zama-ai/fhevm-react-template)** - Base project template for FHEVM development
  - Provides the foundational architecture and SDK structure
  - Includes pre-configured Hardhat setup and testing framework
  - Offers React integration patterns for FHEVM

**Special thanks to:**

- **[Zama](https://www.zama.ai/)** for the groundbreaking FHEVM technology and comprehensive developer tools
- **[@zama-ai/fhevm-solidity](https://github.com/zama-ai/fhevm-solidity)** - Solidity library for FHE operations
- **[@zama-fhe/relayer-sdk](https://www.npmjs.com/package/@zama-fhe/relayer-sdk)** - Client-side encryption/decryption SDK
- **[fhevmjs](https://github.com/zama-ai/fhevmjs)** - JavaScript library for FHEVM interaction
- **Ethereum Foundation** for Sepolia testnet infrastructure
- **Tailwind Labs** for Tailwind CSS
- **Vercel** for hosting platform
- **The Open Source Community** for inspiration and collaboration

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-repo/issues)
- **Twitter**: [@SecretRaffle](https://twitter.com/your-handle)
- **Email**: support@secretraffle.xyz

---

<div align="center">

**Built with ❤️ using Zama FHEVM**

[Live Demo](#) • [Documentation](./PRD.md) • [Report Bug](https://github.com/your-repo/issues)

</div>
