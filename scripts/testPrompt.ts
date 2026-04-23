import { getProfile } from "@/lib/profiles/getProfile";
import { buildSystemPrompt } from "@/lib/ai/prompt";

function run() {
  const profile = getProfile({ slug: "example" });

  const prompt = buildSystemPrompt(profile);

  console.log("===== SYSTEM PROMPT =====");
  console.log(prompt);
}

run();
