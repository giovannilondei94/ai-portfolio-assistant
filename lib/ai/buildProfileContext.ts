import { Profile } from "@/types/profile";

function formatList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function formatNamedSection(title: string, items: string[]): string {
  if (items.length === 0) {
    return "";
  }

  return `${title}:\n${formatList(items)}`;
}

export function buildProfileContext(profile: Profile): string {
  const sections: string[] = [
    `Name: ${profile.name}`,
    `Role: ${profile.role}`,
    `Headline: ${profile.headline}`,
    `Summary: ${profile.summary}`,
    `Location: ${profile.location}`,
    `Years of Experience: ${profile.yearsOfExperience}`
  ];

  if (profile.availability) {
    const availabilityLines = [
      profile.availability.engagementTypes?.length
        ? `- Engagement Types: ${profile.availability.engagementTypes.join(", ")}`
        : null,
      profile.availability.noticePeriod
        ? `- Notice Period: ${profile.availability.noticePeriod}`
        : null,
      typeof profile.availability.openToInternational === "boolean"
        ? `- Open to International Roles: ${profile.availability.openToInternational ? "Yes" : "No"}`
        : null
    ].filter(Boolean);

    if (availabilityLines.length > 0) {
      sections.push(`Availability:\n${availabilityLines.join("\n")}`);
    }
  }

  sections.push(formatNamedSection("Strengths", profile.strengths));

  sections.push(
    [
      "Tech Stack:",
      `- Frontend: ${profile.techStack.frontend.join(", ")}`,
      `- Backend: ${profile.techStack.backend.join(", ")}`,
      `- Databases: ${profile.techStack.databases.join(", ")}`,
      `- Tools: ${profile.techStack.tools.join(", ")}`,
      `- Other: ${profile.techStack.other.join(", ")}`
    ].join("\n")
  );

  sections.push(
    `Languages:\n${profile.languages.map((language) => `- ${language.name}: ${language.level}`).join("\n")}`
  );

  sections.push(
    `Experience:\n${profile.experiences
      .map((experience) =>
        [
          `Company: ${experience.company}`,
          `Period: ${experience.period}`,
          `Role: ${experience.role}`,
          `Technologies: ${experience.technologies.join(", ")}`,
          "Highlights:",
          experience.highlights.map((highlight) => `  - ${highlight}`).join("\n")
        ].join("\n")
      )
      .join("\n\n")}`
  );

  sections.push(
    `Projects:\n${profile.projects
      .map((project) => {
        const projectLines = [`- ${project.name}: ${project.description}`];

        if (project.highlights?.length) {
          projectLines.push(...project.highlights.map((highlight) => `  - ${highlight}`));
        }

        if (project.url) {
          projectLines.push(`  - URL: ${project.url}`);
        }

        return projectLines.join("\n");
      })
      .join("\n")}`
  );

  if (profile.interests?.length) {
    sections.push(formatNamedSection("Interests", profile.interests));
  }

  if (profile.personalityTraits?.length) {
    sections.push(formatNamedSection("Personality Traits", profile.personalityTraits));
  }

  if (profile.careerGoals) {
    const goalsSections = [
      profile.careerGoals.shortTerm?.length
        ? `Short Term:\n${formatList(profile.careerGoals.shortTerm)}`
        : null,
      profile.careerGoals.midTerm?.length
        ? `Mid Term:\n${formatList(profile.careerGoals.midTerm)}`
        : null,
      profile.careerGoals.longTerm?.length
        ? `Long Term:\n${formatList(profile.careerGoals.longTerm)}`
        : null
    ].filter(Boolean);

    if (goalsSections.length > 0) {
      sections.push(`Career Goals:\n${goalsSections.join("\n")}`);
    }
  }

  return sections.filter(Boolean).join("\n\n").trim();
}
