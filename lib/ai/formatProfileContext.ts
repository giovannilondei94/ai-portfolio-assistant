import { Profile } from "@/types/profile";

export function formatProfileContext(profile: Profile): string {
  const strengths = profile.strengths.map((item) => `- ${item}`).join("\n");

  const frontend = profile.techStack.frontend.join(", ");
  const backend = profile.techStack.backend.join(", ");
  const databases = profile.techStack.databases.join(", ");
  const tools = profile.techStack.tools.join(", ");
  const other = profile.techStack.other.join(", ");

  const languages = profile.languages
    .map((language) => `- ${language.name}: ${language.level}`)
    .join("\n");

  const experiences = profile.experiences
    .map((experience) => {
      const description = experience.description.map((item) => `  - ${item}`).join("\n");
      const tech = experience.tech.join(", ");

      return [
        `Company: ${experience.company}`,
        `Period: ${experience.period}`,
        `Role: ${experience.role}`,
        `Tech: ${tech}`,
        `Responsibilities:`,
        description
      ].join("\n");
    })
    .join("\n\n");

  const projects = profile.projects
    .map((project) => `- ${project.name}: ${project.description}`)
    .join("\n");

  return `
Name: ${profile.name}
Role: ${profile.role}
Headline: ${profile.headline}
Summary: ${profile.summary}
Location: ${profile.location}
Years of Experience: ${profile.yearsOfExperience}

Strengths:
${strengths}

Tech Stack:
- Frontend: ${frontend}
- Backend: ${backend}
- Databases: ${databases}
- Tools: ${tools}
- Other: ${other}

Languages:
${languages}

Experience:
${experiences}

Projects:
${projects}
`.trim();
}
