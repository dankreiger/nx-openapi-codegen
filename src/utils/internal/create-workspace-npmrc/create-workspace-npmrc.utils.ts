import { write } from "bun";
import type { MonorepoConfig } from "../../../schemas";

export async function createWorkspaceNpmrc(config: MonorepoConfig) {
	await write(
		".npmrc",
		`@${config.npmOrgName}:registry=https://npm.pkg.github.com`,
	);
}
