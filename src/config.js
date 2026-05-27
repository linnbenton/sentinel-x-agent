import dotenv from "dotenv";
import path from "path";

// Memastikan dotenv membaca file .env dari root folder proyek, aman untuk Windows/WSL
dotenv.config();

export const config = {
  // 1. Ace Data Cloud Configurations
  aceData: {
    apiKey: process.env.ACE_DATA_API_KEY,
    baseUrl: "https://api.acedata.cloud",
  },

  // 2. OOBE Protocol & Synapse Configurations
  synapse: {
    rpcUrl: process.env.SYNAPSE_RPC_URL || "https://rpc.oobeprotocol.ai",
    // Sentinel contract address yang wajib kita pakai minimal sekali
    sentinelAddress: "Ccr2yK3hLALU4p8oNRqrh4dGuvPJTth5KCLMio8cE1ph",
  },

  // 3. Solana Wallet (Untuk keperluan x402 payment & signing transaksi)
  solana: {
    privateKey: process.env.SOLANA_PRIVATE_KEY,
    // Gunakan pubkey dummy untuk testing awal biar aman
    targetMockPubkey: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },

  // 4. Agen Automation Settings
  agent: {
    // Interval waktu loop otomatis (dalam milidetik). Kita set 10 menit.
    loopInterval: 10 * 60 * 1000,
  },
};

// Fungsi validasi sederhana untuk memastikan lo ga lupa ngisi file .env sebelum bot jalan
export function validateConfig() {
  if (!config.aceData.apiKey) {
    console.error("❌ ERROR: ACE_DATA_API_KEY belum diisi di file .env!");
    process.exit(1);
  }
  if (!config.solana.privateKey) {
    console.warn(
      "⚠️ WARNING: SOLANA_PRIVATE_KEY belum diisi. Fitur transaksi x402 mungkin terbatas.",
    );
  }
}
