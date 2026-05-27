import { config, validateConfig } from "./config.js";
import {
  fetchTrendingTopics,
  generateContent,
  generateMemeImage,
} from "./services/aceDataService.js";
import { executeX402RpcRequest } from "./services/synapseService.js";

async function startAgentEngine() {
  console.log("\n==================================================");
  console.log(
    `🤖 SENTINEL-X AGENT ACTIVE [${new Date().toLocaleTimeString()}]`,
  );
  console.log("==================================================");

  try {
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

    console.log(
      `\n💤 Cycle completed successfully. Sleeping. Next run in ${config.agent.loopInterval / 60000} minutes...`,
    );
  } catch (globalError) {
    console.error(
      `🚨 Autonomous agent engine loop broken: ${globalError.message}`,
    );
  }
}

// System initialization
validateConfig();
startAgentEngine();
setInterval(startAgentEngine, config.agent.loopInterval);
