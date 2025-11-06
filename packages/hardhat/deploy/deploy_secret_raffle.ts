import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  console.log("\n=== Deploying Secret Raffle Contract ===\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  
  // Deploy SecretRaffle contract
  console.log("Deploying SecretRaffle contract...");
  const SecretRaffle = await hre.ethers.getContractFactory("SecretRaffle");
  const secretRaffle = await SecretRaffle.deploy();
  await secretRaffle.waitForDeployment();
  const raffleAddress = await secretRaffle.getAddress();
  console.log(`✅ SecretRaffle deployed to: ${raffleAddress}`);
  
  // Wait for a few block confirmations
  console.log("\nWaiting for block confirmations...");
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Set the secret number to 1024
  console.log("\nSetting secret number to 1024...");
  try {
    // Import fhevmjs for encryption
    // Note: In production, you'd use the relayer-sdk CDN or npm package
    // For deployment script, we'll use a simpler approach
    
    // For now, we'll just log instructions
    console.log("\n⚠️  MANUAL STEP REQUIRED:");
    console.log("The secret number must be set using an encrypted input.");
    console.log("Run the following command to set the secret number:");
    console.log(`\n  node scripts/setSecretNumber.js ${raffleAddress}\n`);
    
  } catch (error) {
    console.error("Note: Auto-setting secret number requires fhevmjs in Node environment.");
    console.log("You can set it manually from the frontend or a custom script.");
  }
  
  console.log("\n=== Deployment Complete ===");
  console.log(`Contract Address: ${raffleAddress}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log("\n⚠️  Remember to:");
  console.log("1. Set the secret number to 1024 (if not done automatically)");
  console.log("2. Update NEXT_PUBLIC_CONTRACT_ADDRESS in frontend .env");
  console.log("3. Copy the contract address to your frontend configuration\n");
  
  return raffleAddress;
}

// Export the main function for hardhat-deploy
export default main;

// Allow direct execution
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

