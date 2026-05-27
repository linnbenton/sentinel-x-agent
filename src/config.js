import dotenv from "dotenv";
import path from "path";

// Ensure dotenv reads the .env file from the root directory, compatible with Windows/WSL
dotenv.config();

export const config = {
  // 1. Ace Data Cloud Configurations
  aceData: {
    apiKey: process.env.ACE_DATA_API_KEY,
    baseUrl: "https://api.acedata.cloud",
  },

  // 2. OOBE Protocol & Synapse Configurations
  synapse: {
    rpcUrl: process.env.SYNAPSE_RPC_URL || "https://synapse.oobeprotocol.ai",
    // Sentinel contract address required for minimum validation tracking
    sentinelAddress: "Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph",
  },

  // 3. Solana Wallet (Used for x402 payment execution & transaction signing)
  solana: {
    privateKey: process.env.SOLANA_PRIVATE_KEY,
    // Mock public key utilized for initial safe deployment testing
    targetMockPubkey: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },

  // 4. Agent Automation Settings
  agent: {
    // INTERVAL: Set to 24 hours to prevent the autonomous loop from draining the remaining API credits
    loopInterval: 24 * 60 * 60 * 1000,
  },
};

// Simple validation utility to ensure vital environment variables are loaded before runtime
export function validateConfig() {
  if (!config.aceData.apiKey) {
    console.error("❌ ERROR: ACE_DATA_API_KEY is missing in the .env file!");
    process.exit(1);
  }
  if (!config.solana.privateKey) {
    console.warn(
      "⚠️ WARNING: SOLANA_PRIVATE_KEY is not defined. Autonomous x402 transaction features may be restricted.",
    );
  }
}
