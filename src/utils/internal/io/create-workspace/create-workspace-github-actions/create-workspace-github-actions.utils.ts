import { mkdir, writeFile } from "node:fs/promises";
import type { ReadonlyDeep } from "type-fest";
import yaml from "yaml";
import { BUN_VERSION } from "../../../../../constants/index.ts";
import type { MonorepoConfig } from "../../../../../schemas/index.ts";
import type { HttpsJsonSchemastoreOrgGithubActionJson } from "../../../../../types/github-action.d.ts";
import { Logger } from "../../logger/index.ts";

type GithubActionName =
	| "prepare-authorized-environment"
	| "bun-install-dependencies";
type GithubActionNameString<T extends GithubActionName = GithubActionName> =
	`${T}/action.yml`;
type GithubAction<T extends GithubActionName = GithubActionName> = ReadonlyDeep<
	Record<GithubActionNameString<T>, HttpsJsonSchemastoreOrgGithubActionJson>
>;

export async function createWorkspaceGithubActions(config: MonorepoConfig) {
	const actionsDir = ".github/actions";
	const CURRENT_NODE_VERSION = (await Bun.$`node --version`.text())
		.trim()
		.replace("v", "")
		.replace("\n", "");

	// Ensure directories exist
	await mkdir(`${actionsDir}/bun-install-dependencies`, { recursive: true });
	await mkdir(`${actionsDir}/prepare-authorized-environment`, {
		recursive: true,
	});

	// Define composite actions in JSON
	const actions = {
		"bun-install-dependencies/action.yml": {
			name: "Bun Install Dependencies",
			description: "Prepares the repo by installing dependencies using Bun",
			runs: {
				using: "composite",
				steps: [
					{
						name: "Install Bun",
						uses: "oven-sh/setup-bun@v2",
						with: { "bun-version": BUN_VERSION },
					},
					{
						name: "Install dependencies",
						shell: "bash",
						run: "bun install --frozen-lockfile",
					},
				],
			},
		},
		"prepare-authorized-environment/action.yml": {
			name: "Prepare Authorized Environment",
			description:
				"Sets up node.js with GitHub token, nx cache, and git config, and installs dependencies using Bun",
			inputs: {
				branch: {
					description: "Branch name",
					required: false,
				},
				token: {
					description: "GitHub token",
					required: true,
				},
			},
			runs: {
				using: "composite",
				steps: [
					{
						name: `"Use Node.js ${CURRENT_NODE_VERSION}"`,
						uses: "actions/setup-node@v4",
						with: {
							"node-version": `${CURRENT_NODE_VERSION}`,
							"registry-url": "https://npm.pkg.github.com",
							scope: `${config.npmOrgScope}`,
							token: "${{ inputs.token }}",
						},
					},
					{
						name: "Git config",
						shell: "bash",
						run: `
git config user.name 'github-actions[bot]'
git config user.email 'github-actions[bot]@users.noreply.github.com'`,
					},
					{
						name: "Bun Install Dependencies",
						uses: "./.github/actions/bun-install-dependencies",
						with: {
							token: "${{ inputs.token }}",
							branch: "${{ inputs.branch }}",
						},
					},
				],
			},
		},
	} as const satisfies GithubAction;

	// Write actions as YAML
	for (const [filename, content] of Object.entries(actions)) {
		const yamlContent = yaml.stringify(content);
		const path = `${actionsDir}/${filename}`;
		console.log(`Creating action: ${path}`);
		await writeFile(path, yamlContent);
	}

	Logger.success("All Github actions have been created successfully.");
}
