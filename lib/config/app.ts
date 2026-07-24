export const profileConfig = {
  defaultSlug: "example",
  envProfileJsonKey: "PROFILE_JSON",
  directorySegments: ["data", "profiles"] as const
} as const;

export const chatConfig = {
  model: "gpt-4.1-mini",
  maxConversationMessages: 10
} as const;

export const siteConfig = {
  activeProfileSlug: process.env.ACTIVE_PROFILE_SLUG?.trim() || profileConfig.defaultSlug
} as const;
