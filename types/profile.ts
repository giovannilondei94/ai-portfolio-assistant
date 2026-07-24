import type { z } from "zod";
import type {
  profileAvailabilitySchema,
  profileCareerGoalsSchema,
  profileExperienceSchema,
  profileLanguageSchema,
  profileProjectSchema,
  profileSchema,
  profileTechStackSchema
} from "@/lib/profiles/profileSchema";

export type ProfileLanguage = z.infer<typeof profileLanguageSchema>;
export type ProfileExperience = z.infer<typeof profileExperienceSchema>;
export type ProfileProject = z.infer<typeof profileProjectSchema>;
export type ProfileTechStack = z.infer<typeof profileTechStackSchema>;
export type ProfileAvailability = z.infer<typeof profileAvailabilitySchema>;
export type ProfileCareerGoals = z.infer<typeof profileCareerGoalsSchema>;
export type Profile = z.infer<typeof profileSchema>;

export type LoadProfileOptions = {
  profileSlug?: string;
};
