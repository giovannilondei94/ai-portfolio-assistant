import ChatWidget from "@/components/ai-chat/ChatWidget";
import { getProfile } from "@/lib/profiles/getProfile";

export default function Home() {
  const profileSlug = "example";
  const profile = getProfile({ slug: profileSlug });

  return (
    <main className="flex flex-1 bg-zinc-50">
      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 py-24 sm:px-10 lg:px-12">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            MVP
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            AI Portfolio Assistant
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            An embeddable AI assistant for interactive developer portfolios, designed to help recruiters explore
            experience, skills, technologies, and professional background through conversation.
          </p>
        </div>
      </section>
      <ChatWidget profileName={profile.name} profileSlug={profileSlug} />
    </main>
  );
}
