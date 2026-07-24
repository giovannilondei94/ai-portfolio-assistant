import { NextRequest, NextResponse } from "next/server";
import {
  EmptyAssistantReplyError,
  generateProfileChatReply,
  MissingOpenAiApiKeyError
} from "@/lib/chat/reply";
import { parseChatRequest } from "@/lib/chat/schema";
import {
  ProfileJsonParseError,
  ProfileNotFoundError,
  ProfileValidationError
} from "@/lib/profiles/errors";
import { loadProfile } from "@/lib/profiles/loadProfile";

export async function POST(req: NextRequest) {
  try {
    const requestBody = parseChatRequest(await req.json());
    const profile = loadProfile({ profileSlug: requestBody.profileSlug });
    const reply = await generateProfileChatReply(profile, requestBody.messages);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof ProfileNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (
      error instanceof ProfileJsonParseError ||
      error instanceof ProfileValidationError ||
      error instanceof MissingOpenAiApiKeyError ||
      error instanceof EmptyAssistantReplyError
    ) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof Error && error.message.startsWith("Invalid chat request body.")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Something went wrong while generating the response." },
      { status: 500 }
    );
  }
}
