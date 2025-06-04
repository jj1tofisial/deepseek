import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "DeepSeek Chat Title Generator",
  },
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({
        success: false,
        message: "Prompt is required to generate a title",
      });
    }

    // Compose the system prompt and user prompt to ask for a concise chat title
    const messages = [
      {
        role: "system",
        content:
          "You are an assistant that generates a concise, relevant, and catchy chat title based on the user's first prompt. " +
          "Keep the title under 10 words and do not include quotes or special characters.",
      },
      {
        role: "user",
        content: `Create a chat title based on this prompt:\n"${prompt}"`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages,
      max_tokens: 20,
      temperature: 0.7,
    });

    const generatedTitle = response.choices?.[0]?.message?.content?.trim();

    if (!generatedTitle) {
      return NextResponse.json({
        success: false,
        message: "Failed to generate a title",
      });
    }

    return NextResponse.json({
      success: true,
      title: generatedTitle,
    });
  } catch (error) {
    console.error("Error generating chat title:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
