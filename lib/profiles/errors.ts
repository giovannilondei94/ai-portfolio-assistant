export class ProfileNotFoundError extends Error {
  constructor(public readonly profileSlug: string, public readonly filePath: string) {
    super(`Profile file not found for slug "${profileSlug}" at ${filePath}.`);
    this.name = "ProfileNotFoundError";
  }
}

export class ProfileJsonParseError extends Error {
  constructor(public readonly sourceLabel: string, public readonly causeError: Error) {
    super(`Profile JSON is malformed for source "${sourceLabel}": ${causeError.message}`);
    this.name = "ProfileJsonParseError";
  }
}

export class ProfileValidationError extends Error {
  constructor(public readonly sourceLabel: string, public readonly issues: string[]) {
    super(`Profile schema is invalid for source "${sourceLabel}": ${issues.join("; ")}`);
    this.name = "ProfileValidationError";
  }
}
