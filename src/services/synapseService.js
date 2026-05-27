import axios from "axios";
import { config } from "../config.js";

export async function executeX402RpcRequest(method, params = []) {
  const targetUrl = config.synapse.rpcUrl; // Base gateway URL
  const requestBody = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: method,
    params: params,
  };

  try {
    console.log(
      `⚡ [x402] Executing initial validation request for: ${method}`,
    );
    const response = await axios.post(targetUrl, requestBody, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 402) {
      console.log(
        `⚠️ [402] Payment Required detected for ${method}. Authorizing autonomous payment payload...`,
      );

      try {
        const base64PaymentPayload = Buffer.from(
          JSON.stringify({
            wallet: config.solana.privateKey
              ? "SIGNED_USER_WALLET"
              : "DEMO_WALLET",
            fee: 0.05,
            facilitator: "AceDataCloud",
            timestamp: Date.now(),
          }),
        ).toString("base64");

        const retryResponse = await axios.post(targetUrl, requestBody, {
          headers: {
            "Content-Type": "application/json",
            "X-PAYMENT": base64PaymentPayload,
          },
        });

        return retryResponse.data;
      } catch (paymentError) {
        console.error(
          `❌ [x402] Internal payment encryption failed: ${paymentError.message}`,
        );
      }
    } else {
      console.error(
        `❌ [RPC Network] Synapse gateway connection problem: ${error.message}`,
      );
    }
  }
}
