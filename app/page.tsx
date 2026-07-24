import ChatWidget from "@/components/ai-chat/ChatWidget";
import { siteConfig } from "@/lib/config/app";
import { loadProfile } from "@/lib/profiles/loadProfile";

function formatTechGroups(groups: Record<string, string[]>) {
  return Object.entries(groups).filter(([, values]) => values.length > 0);
}

export default function Home() {
  const profileSlug = siteConfig.activeProfileSlug;
  const profile = loadProfile({ profileSlug });
  const techGroups = formatTechGroups(profile.techStack);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.15),_transparent_30%),linear-gradient(180deg,_#f7f5ef_0%,_#f2efe7_42%,_#ebe7dc_100%)] text-stone-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-stone-300/70 bg-white/85 p-8 shadow-[0_20px_80px_rgba(41,37,36,0.08)] backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              <span className="rounded-full bg-amber-100 px-3 py-1">Java</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Spring Boot</span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">Angular</span>
            </div>

            <h1 className="mt-6 max-w-3xl font-sans text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-3xl text-xl leading-8 text-stone-700">{profile.headline}</p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-700">
              <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2">{profile.location}</span>
              <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
                {profile.yearsOfExperience}+ anni di esperienza
              </span>
              {profile.availability?.engagementTypes?.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2"
                >
                  Disponibile per {item.toLowerCase()}
                </span>
              ))}
            </div>

            <p className="mt-8 max-w-4xl text-base leading-8 text-stone-700 sm:text-lg">{profile.summary}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-stone-50">
                <div className="text-sm uppercase tracking-[0.2em] text-stone-300">Focus</div>
                <div className="mt-3 text-2xl font-semibold">Enterprise software</div>
              </div>
              <div className="rounded-[1.5rem] bg-white px-5 py-5 ring-1 ring-stone-200">
                <div className="text-sm uppercase tracking-[0.2em] text-stone-500">Settori</div>
                <div className="mt-3 text-2xl font-semibold text-stone-950">PA e sanita</div>
              </div>
              <div className="rounded-[1.5rem] bg-white px-5 py-5 ring-1 ring-stone-200">
                <div className="text-sm uppercase tracking-[0.2em] text-stone-500">Approccio</div>
                <div className="mt-3 text-2xl font-semibold text-stone-950">Legacy + modernizzazione</div>
              </div>
            </div>
          </div>

          <aside className="grid gap-6">
            <div className="rounded-[2rem] border border-stone-300/70 bg-stone-950 p-7 text-stone-50 shadow-[0_20px_80px_rgba(41,37,36,0.12)]">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Punti di forza</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-200">
                {profile.strengths.map((strength) => (
                  <li key={strength}>• {strength}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-stone-300/70 bg-white/90 p-7 shadow-[0_20px_80px_rgba(41,37,36,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Lingue</p>
              <div className="mt-5 space-y-4">
                {profile.languages.map((language) => (
                  <div key={language.name} className="flex items-center justify-between gap-4">
                    <span className="text-base font-medium text-stone-900">{language.name}</span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
                      {language.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-stone-300/70 bg-white/90 p-8 shadow-[0_20px_80px_rgba(41,37,36,0.08)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Competenze tecniche</p>
            <div className="mt-6 grid gap-5">
              {techGroups.map(([groupName, values]) => (
                <div key={groupName} className="rounded-[1.5rem] bg-stone-50 p-5 ring-1 ring-stone-200">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {groupName}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {values.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-300/70 bg-white/90 p-8 shadow-[0_20px_80px_rgba(41,37,36,0.08)]">
            <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Esperienze professionali</p>
            <div className="mt-6 space-y-6">
              {profile.experiences.map((experience) => (
                <article
                  key={`${experience.company}-${experience.period}`}
                  className="rounded-[1.5rem] border border-stone-200 bg-white p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-stone-950">{experience.role}</h2>
                      <p className="mt-1 text-base text-stone-700">{experience.company}</p>
                    </div>
                    <div className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
                      {experience.period}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-700">
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>• {highlight}</li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-800 ring-1 ring-amber-200"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-300/70 bg-stone-950 p-8 text-stone-50 shadow-[0_20px_80px_rgba(41,37,36,0.12)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Progetti e domini</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Contesti reali, non demo</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-stone-300">
              Esperienza su piattaforme operative per enti locali, sistemi ospedalieri e software clinico
              utilizzato quotidianamente da professionisti e organizzazioni.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {profile.projects.map((project) => (
              <article key={project.name} className="rounded-[1.5rem] bg-stone-900 p-6 ring-1 ring-stone-800">
                <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">{project.description}</p>
                {project.highlights?.length ? (
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-stone-200">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>• {highlight}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </section>

      <ChatWidget profileName={profile.name} profileSlug={profileSlug} />
    </main>
  );
}
