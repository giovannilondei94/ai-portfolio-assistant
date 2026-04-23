export type ProfileLanguage = {
  name: string;
  level: string;
};

export type ProfileExperience = {
  company: string;
  period: string;
  role: string;
  description: string[];
  tech: string[];
};

export type ProfileProject = {
  name: string;
  description: string;
};

export type ProfileTechStack = {
  frontend: string[];
  backend: string[];
  databases: string[];
  tools: string[];
  other: string[];
};

export type Profile = {
  name: string;
  role: string;
  headline: string;
  summary: string;
  location: string;
  yearsOfExperience: number;
  strengths: string[];
  techStack: ProfileTechStack;
  languages: ProfileLanguage[];
  experiences: ProfileExperience[];
  projects: ProfileProject[];
};
