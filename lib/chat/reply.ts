import OpenAI from "openai";
import { buildPortfolioAssistantSystemPrompt } from "@/lib/ai/buildSystemPrompt";
import { chatConfig } from "@/lib/config/app";
import { getRecentConversationMessages } from "@/lib/chat/schema";
import { ChatMessage } from "@/types/chat";
import { Profile } from "@/types/profile";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class MissingOpenAiApiKeyError extends Error {
  constructor() {
    super("Missing OPENAI_API_KEY environment variable.");
    this.name = "MissingOpenAiApiKeyError";
  }
}

export class EmptyAssistantReplyError extends Error {
  constructor() {
    super("The assistant returned an empty response.");
    this.name = "EmptyAssistantReplyError";
  }
}

export async function generateProfileChatReply(profile: Profile, messages: ChatMessage[]): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new MissingOpenAiApiKeyError();
  }

  const systemPrompt = buildPortfolioAssistantSystemPrompt(profile);
  const recentMessages = getRecentConversationMessages(messages);

  const response = await openaiClient.responses.create({
    model: chatConfig.model,
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
    throw new EmptyAssistantReplyError();
  }

  return reply;
}
