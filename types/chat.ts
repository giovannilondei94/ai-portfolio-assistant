export type ChatMessageRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
};

export type ChatRequest = {
  profileSlug?: string;
  messages: ChatMessage[];
};

export type ChatSuccessResponse = {
  reply: string;
};

export type ChatErrorResponse = {
  error: string;
};

export type ChatResponse = ChatSuccessResponse | ChatErrorResponse;
