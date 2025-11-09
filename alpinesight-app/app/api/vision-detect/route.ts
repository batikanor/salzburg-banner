import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "edge";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface VisionRequest {
  imageUrl: string;
  provider: "anthropic" | "openai";
}

async function detectWithClaude(imageUrl: string) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  // Fetch the image and convert to base64
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `Analyze this satellite/aerial image and count the number of vehicles (cars, trucks, vans) visible.

Please respond in this exact JSON format:
{
  "vehicleCount": <number>,
  "confidence": <0.0 to 1.0>,
  "description": "<brief description of what you see>"
}

Be conservative - only count objects you're reasonably confident are vehicles. The image may be blurry or low quality.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse JSON from Claude response");
  }

  return JSON.parse(jsonMatch[0]);
}

async function detectWithOpenAI(imageUrl: string) {
  // Configure OpenAI provider based on environment
  let openai;
  let modelName;

  if (OPENROUTER_API_KEY) {
    // Local development: Use OpenRouter
    openai = createOpenAI({
      apiKey: OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
    modelName = "openai/gpt-5-mini"; // OpenRouter format
  } else {
    // Production (Vercel): Use Vercel AI Gateway with OIDC
    openai = createOpenAI({
      // Vercel AI SDK automatically uses OIDC token on Vercel
      baseURL: "https://api.openai.com/v1",
    });
    modelName = "gpt-5-mini"; // Standard OpenAI format
  }

  const prompt = `Analyze this satellite/aerial image and count the number of vehicles (cars, trucks, vans) visible.

Please respond in this exact JSON format:
{
  "vehicleCount": <number>,
  "confidence": <0.0 to 1.0>,
  "description": "<brief description of what you see>"
}

Be conservative - only count objects you're reasonably confident are vehicles. The image may be blurry or low quality.`;

  try {
    const { text } = await generateText({
      model: openai(modelName),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image", image: imageUrl },
          ],
        },
      ],
      maxTokens: 1024,
    });

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("OpenAI vision error:", error);
    throw new Error(`Vision API error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: VisionRequest = await request.json();
    const { imageUrl, provider } = body;

    console.log(`🔍 Vision detection request: ${provider} for ${imageUrl}`);

    let result;
    if (provider === "anthropic") {
      result = await detectWithClaude(imageUrl);
    } else {
      result = await detectWithOpenAI(imageUrl);
    }

    console.log(`✅ Vision detection result:`, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Vision detection error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
