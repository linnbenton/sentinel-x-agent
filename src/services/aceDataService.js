import axios from "axios";
import { config } from "../config.js";

const HEADERS = {
  Authorization: `Bearer ${config.aceData.apiKey}`,
  "Content-Type": "application/json",
};

// API 1: Fetching viral topics from the web
export async function fetchTrendingTopics() {
  try {
    const response = await axios.get(`${config.aceData.baseUrl}/v1/trending`, {
      headers: HEADERS,
    });
    return (
      response.data.trending?.[0] || response.data || "Solana Autonomous Agents"
    );
  } catch (error) {
    console.warn(
      "⚠️ [Trending] Failed to fetch live trends. Using local fallback data.",
    );
    return "Solana Memecoin Szn";
  }
}

// API 2: Processing data into an alpha tweet via LLM Chat API
export async function generateContent(trend) {
  try {
    const response = await axios.post(
      `${config.aceData.baseUrl}/v1/chat/completions`,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Generate an engaging market prediction tweet about: ${trend}`,
          },
        ],
      },
      { headers: HEADERS },
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`❌ [LLM] Failed to generate content: ${error.message}`);
    return `🚨 ${trend} is exploding right now! Keep an eye on it. #Solana`;
  }
}

// API 3: Generating visual media using Image Generation API
export async function generateMemeImage(content) {
  try {
    // CLEANUP: Remove emojis and special characters from the LLM text to prevent API validation failures
    const cleanPrompt = `Futuristic cyberpunk digital art showing: ${content.replace(/[^\w\s]/gi, "").substring(0, 150)}`;

    const response = await axios.post(
      `${config.aceData.baseUrl}/v1/images/generations`,
      {
        prompt: cleanPrompt,
        n: 1,
        size: "1024x1024",
      },
      { headers: HEADERS },
    );

    // DYNAMIC PARSING: Extract the image URL based on Ace Data Cloud's response payload structure
    return (
      response.data.data?.[0]?.url ||
      response.data.image_url ||
      "https://via.placeholder.com/1024"
    );
  } catch (error) {
    // DEBUGGING: Extract specific error messages from the server response for easier troubleshooting
    const errorDetail = error.response?.data?.error?.message || error.message;
    console.error(
      `❌ [Image API] Failed to generate meme asset: ${errorDetail}`,
    );
    return "https://via.placeholder.com/1024";
  }
}
