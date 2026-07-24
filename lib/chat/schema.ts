import { z } from "zod";
import { chatConfig } from "@/lib/config/app";
import { ChatRequest } from "@/types/chat";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1)
});

export const chatRequestSchema = z.object({
  profileSlug: z.string().trim().min(1).optional(),
  messages: z.array(chatMessageSchema).min(1)
});

export function parseChatRequest(payload: unknown): ChatRequest {
  const result = chatRequestSchema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => {
        const issuePath = issue.path.length > 0 ? issue.path.join(".") : "root";
        return `${issuePath}: ${issue.message}`;
      })
      .join("; ");

    throw new Error(`Invalid chat request body. ${message}`);
  }

  return result.data;
}

export function getRecentConversationMessages(messages: ChatRequest["messages"]): ChatRequest["messages"] {
  return messages.slice(-chatConfig.maxConversationMessages);
}
