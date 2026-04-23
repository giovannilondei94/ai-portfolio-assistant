import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getProfile } from "@/lib/profiles/getProfile";
import { buildSystemPrompt, getRecentMessages } from "@/lib/ai/prompt";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  profileSlug?: string;
  messages?: ChatMessage[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function isValidMessage(message: unknown): message is ChatMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as ChatMessage;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ChatRequestBody;

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Invalid request body. 'messages' must be an array." },
        { status: 400 }
      );
    }

    const validMessages = body.messages.filter(isValidMessage);

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "At least one valid message is required." },
        { status: 400 }
      );
    }

    const profile = getProfile({
      slug: body.profileSlug?.trim() || "example"
    });

    const systemPrompt = buildSystemPrompt(profile);
    const recentMessages = getRecentMessages(validMessages);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        ...recentMessages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      ]
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return NextResponse.json(
        { error: "The assistant returned an empty response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating the response." },
      { status: 500 }
    );
  }
}
