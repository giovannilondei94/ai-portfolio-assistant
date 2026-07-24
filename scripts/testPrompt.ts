import { buildPortfolioAssistantSystemPrompt } from "@/lib/ai/buildSystemPrompt";
import { loadProfile } from "@/lib/profiles/loadProfile";

function run() {
  const profile = loadProfile({ profileSlug: "example" });
  const prompt = buildPortfolioAssistantSystemPrompt(profile);

  console.log("===== SYSTEM PROMPT =====");
  console.log(prompt);
}

run();
