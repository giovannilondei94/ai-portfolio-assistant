import fs from "node:fs";
import path from "node:path";
import { profileConfig } from "@/lib/config/app";
import {
  ProfileJsonParseError,
  ProfileNotFoundError,
  ProfileValidationError
} from "@/lib/profiles/errors";
import { profileSchema } from "@/lib/profiles/profileSchema";
import { Profile, LoadProfileOptions } from "@/types/profile";

function getProfilesDirectoryPath(): string {
  return path.join(
    /* turbopackIgnore: true */ process.cwd(),
    profileConfig.directorySegments[0],
    profileConfig.directorySegments[1]
  );
}

function getProfileFilePath(profileSlug: string): string {
  return path.join(getProfilesDirectoryPath(), `${profileSlug}.json`);
}

function validateProfileData(data: unknown, sourceLabel: string): Profile {
  const result = profileSchema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => {
      const issuePath = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${issuePath}: ${issue.message}`;
    });

    throw new ProfileValidationError(sourceLabel, issues);
  }

  return result.data;
}

function parseProfileJson(rawProfileJson: string, sourceLabel: string): Profile {
  try {
    const parsedJson = JSON.parse(rawProfileJson) as unknown;
    return validateProfileData(parsedJson, sourceLabel);
  } catch (error) {
    if (error instanceof ProfileValidationError) {
      throw error;
    }

    const parsingError =
      error instanceof Error ? error : new Error("Unknown JSON parsing error.");

    throw new ProfileJsonParseError(sourceLabel, parsingError);
  }
}

export function loadProfile(options: LoadProfileOptions = {}): Profile {
  const profileSlug = options.profileSlug?.trim() || profileConfig.defaultSlug;
  const envProfileJson = process.env[profileConfig.envProfileJsonKey];

  if (envProfileJson) {
    return parseProfileJson(envProfileJson, `env:${profileConfig.envProfileJsonKey}`);
  }

  const profileFilePath = getProfileFilePath(profileSlug);

  if (!fs.existsSync(profileFilePath)) {
    throw new ProfileNotFoundError(profileSlug, profileFilePath);
  }

  const profileFileContent = fs.readFileSync(profileFilePath, "utf-8");

  return parseProfileJson(profileFileContent, profileFilePath);
}
