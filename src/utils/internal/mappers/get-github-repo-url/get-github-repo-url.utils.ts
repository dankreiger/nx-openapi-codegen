import type { MonorepoConfig } from "../../../../schemas/index.ts";

export function getGithubRepoUrl(config: MonorepoConfig) {
	return `https://github.com/${config.githubOrgName}/${config.githubRepoName}.git` as const;
}
