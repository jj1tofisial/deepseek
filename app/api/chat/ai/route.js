export const maxDuration = 60;
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Chat from "@/models/Chat";
import connectDB from "@/config/db";

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

    // Format the prompt
    const formattedPrompt = `User: ${prompt}\nAssistant:`;

    const response = await fetch("https://api-inference.huggingface.co/models/sarvamai/sarvam-m", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: formattedPrompt }),
    });

    const responseText = await response.text();

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Non-JSON response from HuggingFace:", responseText);
      return NextResponse.json({
        success: false,
        message: "API did not return valid JSON.",
        raw: responseText,
      });
    }

    let generatedText = "Sorry, no response";
    if (Array.isArray(result) && result[0]?.generated_text) {
      generatedText = result[0].generated_text.replace(formattedPrompt, "").trim();
    } else if (result.generated_text) {
      generatedText = result.generated_text.replace(formattedPrompt, "").trim();
    } else if (result.error) {
      return NextResponse.json({ success: false, message: result.error });
    }

    const message = {
      role: "assistant",
      content: generatedText,
      timestamp: Date.now(),
    };

    data.messages.push(message);
    await data.save();

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
