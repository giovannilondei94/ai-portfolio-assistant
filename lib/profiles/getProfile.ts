import fs from "node:fs";
import path from "node:path";
import { Profile } from "@/types/profile";

type GetProfileOptions = {
  slug?: string;
};

function parseProfileJson(raw: string): Profile {
  return JSON.parse(raw) as Profile;
}

function getLocalProfilePath(slug: string): string {
  return path.join(process.cwd(), "data", "profiles", `${slug}.json`);
}

export function getProfile(options: GetProfileOptions = {}): Profile {
  const slug = options.slug ?? "example";

  const envProfile = process.env.PROFILE_JSON;

  if (envProfile) {
    return parseProfileJson(envProfile);
  }

  const filePath = getLocalProfilePath(slug);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Profile file not found for slug: ${slug}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parseProfileJson(fileContent);
}
