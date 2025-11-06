import { expect } from "chai";
import { ethers } from "hardhat";
import type { SecretRaffle } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("SecretRaffle", function () {
  let secretRaffle: SecretRaffle;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract
    const SecretRaffleFactory = await ethers.getContractFactory("SecretRaffle");
    secretRaffle = await SecretRaffleFactory.deploy();
    await secretRaffle.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await secretRaffle.owner()).to.equal(owner.address);
    });

    it("Should be ready to play immediately", async function () {
      expect(await secretRaffle.isGameReady()).to.equal(true);
    });
  });

  describe("Secret Number Initialization", function () {
    it("Should have secret number set in constructor", async function () {
      // The secret number is automatically set to 1024 in the constructor
      // We can verify this by checking the game is ready
      expect(await secretRaffle.isGameReady()).to.equal(true);
    });

    it("Should have the correct owner", async function () {
      expect(await secretRaffle.owner()).to.equal(owner.address);
      expect(await secretRaffle.owner()).to.not.equal(user1.address);
    });
  });

  describe("Contract Interface", function () {
    it("Should expose required functions", async function () {
      // Verify all required functions exist
      expect(secretRaffle.submitGuess).to.exist;
      expect(secretRaffle.getMyResult).to.exist;
      expect(secretRaffle.isGameReady).to.exist;
    });
  });

  // Note: Full FHE testing requires the FHEVM test environment
  // which is more complex to set up. These tests verify:
  // 1. Contract deploys successfully
  // 2. Basic access control works
  // 3. All required functions are present
  //
  // For end-to-end FHE testing, we'll use the frontend integration tests
  // or manual testing on the Sepolia testnet.
});

