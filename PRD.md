# Secret Raffle - Product Requirements Document

> A Web3 Privacy-Preserving Lottery Platform Built on FHEVM

## 1. Project Overview

### 1.1 Vision Statement
Build a decentralized lottery platform powered by Fully Homomorphic Encryption (FHE) that ensures fairness and user privacy through on-chain encrypted computation.

### 1.2 Problem Statement

**Traditional Web2 Lottery Platforms Face Critical Issues:**

1. **Lack of Transparency (Black Box)**
   - Centralized servers control lottery logic
   - Users cannot verify fairness
   - Results are manipulable without detection

2. **Prize Redemption Difficulties**
   - Organizers can refuse to honor prizes
   - No guarantee of payout
   - High cost for users to seek recourse

3. **Limited Gameplay**
   - Only basic interactions (follow, retweet)
   - Lack of engagement and fun
   - Cannot meet diverse user needs

### 1.3 Solution

**Secret Raffle leverages Zama's FHEVM technology to provide:**

- ✅ **Transparent Mechanism**: All lottery logic executes publicly on blockchain with auditable smart contracts
- ✅ **Automatic Prize Distribution**: Prizes pre-deposited in smart contracts, automatically transferred upon winning
- ✅ **Multiple Game Modes**: Support for traditional lottery, number guessing, prediction games, and more
- ✅ **Privacy Protection**: FHE encryption ensures user data remains confidential while enabling computation
- ✅ **Multi-Platform Integration**: Extensible to Twitter, Telegram, Discord, and other social platforms
- ✅ **Token/NFT Requirements**: Set participation thresholds to filter quality participants

### 1.4 Product Positioning

**The First Web3 Lottery Platform Combining Blockchain and Web2 Social**

- Integrate Web3 (blockchain transparency) with Web2 (social media reach)
- Future support for multiple game modes and social platform logins
- Current Demo: Number Guessing Game (Twitter + encrypted number submission)

---

## 2. Core Features

### 2.1 Current Demo: Number Guessing Game

#### Feature Description
Users submit a guessed number (0-10000), which is compared against a preset lucky number (1024) using encrypted computation, returning "Correct" or "Incorrect" results.

#### FHE Value Proposition
- User's guessed number **remains encrypted throughout the entire process**
- Smart contract performs comparison **without decryption**
- Only the user can decrypt and view their own result
- Other users and contract creator **cannot** see the guessed number

#### Game Rules
- **Answer Range**: 0-10000
- **Correct Answer**: 1024 (pre-set in contract)
- **Attempts**: Unlimited
- **Reward Mechanism**: None (technology demonstration only)

### 2.2 Future Features (Roadmap)

#### Phase 2: Real Lottery System
- Prize pool management
- Automatic winner selection
- Instant prize distribution
- Multi-prize tier support

#### Phase 3: Extended Game Modes
- Traditional random lottery
- Prediction markets
- Quiz games
- Treasure hunts

#### Phase 4: Social Platform Integration
- Twitter OAuth login
- Telegram bot integration
- Discord community binding
- Cross-platform data synchronization

#### Phase 5: Advanced Features
- Token/NFT holding requirements
- VIP tier system
- Referral rewards
- DAO governance

---

## 3. User Flow

### 3.1 Complete User Journey

```
Visit Website
  ↓
Landing Page (View Introduction)
  ↓
Click "Get Started" Button
  ↓
DApp Page - Connect Wallet
  ↓
Fill Form:
  - Twitter Profile URL (format validation)
  - Guessed Number (0-10000)
  ↓
Click "Submit Guess" Button
  ↓
[Backend Process]
  1. FHEVM encrypts user number
  2. Send transaction to smart contract
  3. Contract performs encrypted comparison
  4. Store encrypted result
  5. Frontend decrypts result
  ↓
Display Result: "🎉 Correct!" or "❌ Wrong, Try Again"
  ↓
User Can Continue Guessing (Unlimited)
```

### 3.2 Page Structure

#### Page 1: Landing Page
**Objective**: Brand showcase + user acquisition

**Content Elements**:
- Hero Section:
  - Title: "Secret Raffle · Confidential Lottery"
  - Tagline: "First FHE-powered Web3 lottery platform combining blockchain and social media"
  - Description: Multi-game support, multi-platform integration
  - CTA: "Get Started" (prominent button)

- Pain Points Section:
  - Unfair Black Box
  - Prize Redemption Difficulties  
  - Limited Gameplay

- Why Choose Secret Raffle:
  - Transparent Mechanism, Absolute Fairness
  - Pre-deposited Prizes, Instant Distribution
  - Multiple Game Modes, Rich Interaction

- How It Works:
  - Step 1: Connect Web3 Wallet
  - Step 2: Enter Twitter Link + Guess Number
  - Step 3: View Results, Unlimited Challenges
  - Demo Notice: Current version is technology validation

- Footer:
  - Powered by Zama FHEVM
  - Open Source Links

#### Page 2: DApp Page
**Objective**: Core interaction

**Wallet Not Connected State**:
- Display "Connect Wallet" button
- Prompt: "Please connect your wallet to participate in Secret Raffle lottery"

**Wallet Connected State**:
- Header:
  - Logo + "Secret Raffle"
  - FHEVM Ready indicator (green badge)
  - Wallet address display (abbreviated)
  
- Main Form Area:
  - **Input 1**: Twitter Profile
    - Label: "Twitter Profile URL"
    - Placeholder: "https://twitter.com/yourname"
    - Validation: Must contain "twitter.com/" or "x.com/"
    
  - **Input 2**: Your Lucky Number
    - Label: "Your Lucky Number"
    - Placeholder: "Enter a number between 0-10000"
    - Validation: Integer, range 0-10000
    
  - **Submit Button**: "Submit Guess"
    - Disabled when: submitting / validation errors
    - Shows spinner during submission
    
  - **Privacy Notice**:
    - Explain FHE encryption process
    - Emphasize user privacy protection

- Result Display (After Submission):
  - Success State:
    - Large checkmark icon
    - "🎉 Congratulations!"
    - "You guessed the lucky number!"
    
  - Failure State:
    - Cross icon
    - "❌ Sorry"
    - "Wrong guess, try again!"
    
  - "Try Again" button
  - Display guessed number

- Contract Info Footer:
  - Contract address
  - Etherscan link

---

## 4. Technical Architecture

### 4.1 Technology Stack

**Frontend**:
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Wallet: Custom Wallet Component
- State Management: React Hooks
- Type Safety: TypeScript

**Smart Contract**:
- Language: Solidity ^0.8.24
- FHE Library: @fhevm/solidity
- Development: Hardhat
- Network: Ethereum Sepolia Testnet

**FHEVM Integration**:
- SDK: Custom @fhevm-sdk
- Encryption: fhevmjs + Zama Relayer
- Key Management: Client-side keypair generation

### 4.2 Smart Contract Design

#### Contract: `SecretRaffle.sol`

**State Variables**:
```solidity
euint32 private secretNumber;           // Encrypted answer (1024)
mapping(address => ebool) private userGuessResults;  // User encrypted results
address public owner;
```

**Core Functions**:

1. **`constructor()`**
   - Initializes `secretNumber` to encrypted 1024
   - Sets contract deployer as owner
   - Grants contract self-access permission

2. **`submitGuess(externalEuint32 encryptedGuess, bytes calldata proof)`**
   - Receives user's encrypted guess
   - Validates proof
   - Performs encrypted comparison: `FHE.eq(userGuess, secretNumber)`
   - Stores encrypted boolean result
   - Grants user decryption permission

3. **`getMyResult(address user)`**
   - Returns user's encrypted result handle
   - Used by frontend for decryption

4. **`isGameReady()`**
   - Always returns `true` (secret set in constructor)
   - Frontend can query before allowing submissions

**Security Considerations**:
- Secret number cannot be modified after initialization
- Each user can only see their own results
- All comparisons remain encrypted
- Uses Sepolia configuration from Zama

### 4.3 Frontend FHE Flow

**Encryption Process**:
```typescript
1. User enters number
2. Create encrypted input: createEncryptedInput(contractAddress, userAddress)
3. Add value: input.add32(numberValue)
4. Encrypt and get proof: input.encrypt()
5. Send to contract: submitGuess(encryptedData, proof)
```

**Decryption Process**:
```typescript
1. Get encrypted result handle from contract: getMyResult(userAddress)
2. Generate keypair: instance.generateKeypair()
3. Create EIP-712 signature request
4. User signs with wallet
5. Decrypt: instance.userDecrypt(handle, privateKey, signature, ...)
6. Display boolean result (true = correct, false = incorrect)
```

---

## 5. UI/UX Design

### 5.1 Design Principles

1. **Modern & Clean**
   - White/gray background with indigo blue accents
   - Consistent design language (Tailwind UI)
   - Full dark mode support

2. **User-Friendly**
   - Clear status indicators (FHEVM ready, wallet connected)
   - Real-time validation feedback
   - Loading states for all async operations

3. **Trust-Building**
   - Visible contract address
   - Etherscan verification link
   - Privacy protection notices

### 5.2 Color Scheme

- **Primary**: Indigo Blue (#4F46E5)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale
- **Background**: White (#FFFFFF) / Dark Gray (#111827)

### 5.3 Typography

- **Headings**: Bold, Sans-serif
- **Body**: Regular, Sans-serif
- **Code**: Monospace (for addresses)

---

## 6. Validation Rules

### 6.1 Twitter URL Validation

```typescript
- Required: URL cannot be empty
- Format: Must contain "twitter.com/" OR "x.com/"
- Error Messages:
  - Empty: "Please enter Twitter link"
  - Invalid: "Please enter valid Twitter link (containing twitter.com/ or x.com/)"
```

### 6.2 Number Validation

```typescript
- Required: Number cannot be empty
- Type: Must be valid integer
- Range: 0 ≤ number ≤ 10000
- Error Messages:
  - Empty: "Please enter a number"
  - Invalid: "Please enter a valid number"
  - Too small: "Number cannot be less than 0"
  - Too large: "Number cannot be greater than 10000"
  - Non-integer: "Please enter an integer"
```

---

## 7. Deployment Strategy

### 7.1 Network Configuration

- **Target Network**: Ethereum Sepolia Testnet
- **Chain ID**: 11155111
- **RPC**: Alchemy Sepolia endpoint
- **Faucet**: https://sepoliafaucet.com/

### 7.2 Contract Deployment

**Deployment Script**: `packages/hardhat/deploy/deploy_secret_raffle.ts`

```typescript
1. Deploy SecretRaffle contract
2. Contract constructor automatically sets secretNumber to 1024
3. Verify on Etherscan (optional)
4. Export deployed address
```

### 7.3 Frontend Deployment

**Platform**: Vercel (recommended)

**Environment Variables**:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
```

---

## 8. Testing Strategy

### 8.1 Smart Contract Tests

**Test File**: `packages/hardhat/test/SecretRaffle.test.ts`

**Test Cases**:
1. Contract deploys with secret number set
2. `isGameReady()` returns true
3. User can submit encrypted guess
4. Encrypted result is stored correctly
5. User can retrieve their result
6. Multiple users can play independently

### 8.2 Frontend Tests

**Test Scenarios**:
1. Wallet connection flow
2. FHEVM initialization
3. Form validation (Twitter URL, number)
4. Submission process (encryption, transaction, decryption)
5. Result display (success/failure)
6. Error handling (wrong network, transaction failure)

---

## 9. Success Metrics

### 9.1 Technical Metrics

- ✅ Contract deployed on Sepolia
- ✅ Successful end-to-end encrypted flow
- ✅ Zero privacy leaks (encrypted throughout)
- ✅ Sub-10 second transaction finality

### 9.2 User Experience Metrics

- ✅ Intuitive UI (no training required)
- ✅ Clear feedback at each step
- ✅ Mobile responsive design
- ✅ Dark mode support

### 9.3 Demo Quality Metrics

- ✅ Professional landing page
- ✅ Smooth wallet connection
- ✅ Error-free submission flow
- ✅ Deployed and accessible online

---

## 10. Future Enhancements

### 10.1 Short-term (V1.1)

- Add sound effects for results
- Confetti animation on success
- Guess history tracker
- Share results on Twitter

### 10.2 Mid-term (V2.0)

- Real prize pool with ETH/tokens
- Multiple concurrent games
- Leaderboard (anonymous)
- Advanced analytics

### 10.3 Long-term (V3.0)

- Multi-chain support
- Mobile app
- DAO governance
- Integration marketplace

---

## 11. Risk Mitigation

### 11.1 Technical Risks

**Risk**: FHEVM gas costs too high
- **Mitigation**: Use efficient euint32 type, optimize contract logic

**Risk**: Relayer service downtime
- **Mitigation**: Implement retry logic, show clear error messages

**Risk**: Wallet compatibility issues
- **Mitigation**: Test with multiple wallet providers, provide fallback options

### 11.2 User Experience Risks

**Risk**: Users don't understand FHE
- **Mitigation**: Clear educational content, simple metaphors ("magic lockbox")

**Risk**: Complex multi-step flow
- **Mitigation**: Progress indicators, clear status messages

---

## 12. Appendix

### 12.1 Contract Address

**Sepolia**: `0x15eB8FeE645286BA7F15704cF0C991A4cD35cbA2`

### 12.2 Key Resources

- **Zama Documentation**: https://docs.zama.ai/fhevm
- **FHEVM GitHub**: https://github.com/zama-ai/fhevm
- **Relayer SDK**: https://cdn.zama.ai/relayer-sdk-js/0.2.0/

### 12.3 Demo Access

- **Live Demo**: [To be deployed]
- **GitHub Repository**: [To be published]
- **Demo Video**: [To be recorded]

---

**Last Updated**: 2025-01-06
**Version**: 1.0
**Status**: Technology Demonstration Ready
