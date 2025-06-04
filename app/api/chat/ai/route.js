export const maxDuration = 60;

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Chat from "@/models/Chat";
import connectDB from "@/config/db";
import OpenAI from "openai";

// Initialize OpenAI with OpenRouter DeepSeek R1
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // <-- Set this key in your .env.local
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Replace with your deployed site URL
    "X-Title": "DeepSeek Chat",
  },
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    await connectDB();

    const data = await Chat.findOne({ userId, _id: chatId });
    if (!data) {
      return NextResponse.json({ success: false, message: "Chat not found" });
    }

    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };
    data.messages.push(userPrompt);

    // Keep only recent 10 messages to prevent context overflow
    const chatHistory = data.messages.slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call DeepSeek R1 model via OpenRouter
    const openaiResponse = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: chatHistory,
    });

    const generatedText =
      openaiResponse?.choices?.[0]?.message?.content?.trim() || "No response";

    const message = {
      role: "assistant",
      content: generatedText,
      timestamp: Date.now(),
    };

    data.messages.push(message);
    await data.save();

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
