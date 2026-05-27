import { config, validateConfig } from "../src/config.js";
import {
  fetchTrendingTopics,
  generateContent,
  generateMemeImage,
} from "../src/services/aceDataService.js";
import { executeX402RpcRequest } from "../src/services/synapseService.js";

export default async function handler(request, response) {
  // SECURITY: Validate inbound request authorization header to ensure only Vercel Crons can trigger execution
  const authHeader = request.headers.get("authorization");
  if (
    process.env.VERCEL_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return response
      .status(401)
      .json({ success: false, message: "Unauthorized execution attempt." });
  }

  console.log("\n==================================================");
  console.log(
    `🤖 SENTINEL-X SERVERLESS DEPLOYMENT TRIGGERED [${new Date().toLocaleTimeString()}]`,
  );
  console.log("==================================================");

  try {
    // Enforce basic environment variable validation check
    validateConfig();

    // STEP 1: Discover Trends
    console.log(
      "🔍 [Step 1/4] Scanning current market narratives on Solana Network...",
    );
    const currentTrend = await fetchTrendingTopics();
    console.log(`👉 Result: "${currentTrend}"`);

    // STEP 2: Process text via Ace Data Cloud LLM Chat
    console.log("✍️ [Step 2/4] Querying Ace Data Cloud LLM Chat API...");
    const draftTweet = await generateContent(currentTrend);
    console.log(`👉 Generated Content: "${draftTweet}"`);

    // STEP 3: Create media assets via Ace Data Cloud Image API
    console.log(
      "🎨 [Step 3/4] Generating visual media via Ace Data Cloud Image API...",
    );
    const mediaUrl = await generateMemeImage(draftTweet);
    console.log(`👉 Media URL: ${mediaUrl}`);

    // STEP 4: Trigger On-chain volume tracking via x402
    console.log(
      "💸 [Step 4/4] Syncing transactional activity to Synapse RPC Gateway via x402...",
    );
    const rpcResponse = await executeX402RpcRequest("getAccountInfo", [
      config.synapse.sentinelAddress,
    ]);

    if (rpcResponse) {
      console.log(
        "✅ [Success] Autonomous x402 transaction verified on the network!",
      );
    }

    // Return affirmative status to Vercel runtime platform to complete serverless lifecyle
    return response.status(200).json({
      success: true,
      timestamp: Date.now(),
      payload: { trend: currentTrend, tweet: draftTweet, media: mediaUrl },
    });
  } catch (globalError) {
    console.error(
      `🚨 Serverless agent exception captured: ${globalError.message}`,
    );
    return response
      .status(500)
      .json({ success: false, error: globalError.message });
  }
}
