import { write } from "bun";
import type { MonorepoConfig } from "../../../../../schemas/index.ts";

export async function createWorkspaceNpmrc(config: MonorepoConfig) {
	await write(
		".npmrc",
		`@${config.githubOrgName}:registry=https://npm.pkg.github.com`,
	);
}
