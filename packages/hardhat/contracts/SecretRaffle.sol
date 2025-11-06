// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, externalEuint32, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Secret Raffle - A confidential number guessing game
/// @notice Users submit encrypted guesses and check if they match the secret number
/// @dev Demonstrates FHE by keeping user guesses and results private
contract SecretRaffle is SepoliaConfig {
    
    // The secret lucky number (encrypted, set to 1024)
    euint32 private secretNumber;
    
    // Mapping from user address to their latest guess result (encrypted bool)
    mapping(address => ebool) public userGuessResults;
    
    // Only the contract owner can set the secret number
    address public owner;
    
    event GuessSubmitted(address indexed user);
    event SecretNumberInitialized();
    
    constructor() {
        owner = msg.sender;
        
        // Initialize the secret number to 1024 (encrypted)
        secretNumber = FHE.asEuint32(1024);
        FHE.allowThis(secretNumber);
        
        emit SecretNumberInitialized();
    }
    
    /// @notice Submit a guess for the secret number
    /// @param encryptedGuess The user's encrypted guess (should be 0-10000)
    /// @param proof The input proof for the encrypted guess
    /// @dev The result is stored encrypted and only the user can decrypt it
    function submitGuess(
        externalEuint32 encryptedGuess,
        bytes calldata proof
    ) external {
        
        // Convert external encrypted input to internal encrypted type
        euint32 userGuess = FHE.fromExternal(encryptedGuess, proof);
        
        // Compare the guess with the secret number (result is encrypted)
        ebool isCorrect = FHE.eq(userGuess, secretNumber);
        
        // Store the encrypted result for this user
        userGuessResults[msg.sender] = isCorrect;
        
        // Allow the contract to access this result in future transactions
        FHE.allowThis(isCorrect);
        
        // CRITICAL: Allow the user to decrypt their own result
        FHE.allow(isCorrect, msg.sender);
        
        emit GuessSubmitted(msg.sender);
    }
    
    /// @notice Get the encrypted result handle for a user's latest guess
    /// @param user The address of the user
    /// @return The encrypted boolean result as bytes32
    /// @dev This is used by the frontend to get the handle for decryption
    function getMyResult(address user) external view returns (bytes32) {
        return FHE.toBytes32(userGuessResults[user]);
    }
    
    /// @notice Check if the game is ready to play
    /// @return Always returns true since secret number is set in constructor
    function isGameReady() external pure returns (bool) {
        return true;
    }
}

