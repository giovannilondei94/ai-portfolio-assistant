import { z } from "zod";

const requiredString = z.string().trim().min(1);
const stringList = z.array(requiredString);

export const profileLanguageSchema = z.object({
  name: requiredString,
  level: requiredString
});

export const profileExperienceSchema = z.object({
  company: requiredString,
  period: requiredString,
  role: requiredString,
  highlights: stringList.min(1),
  technologies: stringList.min(1)
});

export const profileProjectSchema = z.object({
  name: requiredString,
  description: requiredString,
  highlights: stringList.min(1).optional(),
  url: z.url().optional()
});

export const profileTechStackSchema = z.object({
  frontend: stringList,
  backend: stringList,
  databases: stringList,
  tools: stringList,
  other: stringList
});

export const profileAvailabilitySchema = z.object({
  engagementTypes: stringList.min(1).optional(),
  noticePeriod: requiredString.optional(),
  openToInternational: z.boolean().optional()
});

export const profileCareerGoalsSchema = z.object({
  shortTerm: stringList.min(1).optional(),
  midTerm: stringList.min(1).optional(),
  longTerm: stringList.min(1).optional()
});

export const profileSchema = z
  .object({
    name: requiredString,
    role: requiredString,
    headline: requiredString,
    summary: requiredString,
    location: requiredString,
    yearsOfExperience: z.number().int().nonnegative(),
    strengths: stringList.min(1),
    techStack: profileTechStackSchema,
    languages: z.array(profileLanguageSchema).min(1),
    experiences: z.array(profileExperienceSchema).min(1),
    projects: z.array(profileProjectSchema),
    availability: profileAvailabilitySchema.optional(),
    careerGoals: profileCareerGoalsSchema.optional(),
    interests: stringList.min(1).optional(),
    personalityTraits: stringList.min(1).optional()
  })
  .strict();
