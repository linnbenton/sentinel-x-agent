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
    const response = await axios.post(
      `${config.aceData.baseUrl}/v1/images/generations`,
      {
        prompt: `Cyberpunk futuristic illustration depicting: ${content.substring(0, 100)}`,
        size: "1024x1024",
      },
      { headers: HEADERS },
    );
    return (
      response.data.image_url ||
      response.data.data?.[0]?.url ||
      "https://via.placeholder.com/1024"
    );
  } catch (error) {
    console.error(
      `❌ [Image API] Failed to generate meme asset: ${error.message}`,
    );
    return "https://via.placeholder.com/1024";
  }
}
