import type { MonorepoConfig } from "../../../schemas";

export function getGithubRepoUrl(config: MonorepoConfig) {
	return `https://github.com/${config.npmOrgName}/${config.repoName}.git` as const;
}
