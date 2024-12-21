import { z } from "zod";

const GITHUB_ORG_OR_REPO_NAME_REGEX = /^[A-Za-z0-9._-]+$/;

export const GithubOrgOrRepoNameSchema = z
	.string()
	.regex(GITHUB_ORG_OR_REPO_NAME_REGEX, {
		message:
			"The repository or organization name can only contain ASCII letters, digits, and the characters ., -, and _.",
	});
