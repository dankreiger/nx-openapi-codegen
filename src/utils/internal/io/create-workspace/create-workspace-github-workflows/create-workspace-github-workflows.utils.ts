import { mkdir, writeFile } from "node:fs/promises";
import type { ReadonlyDeep } from "type-fest";
import yaml from "yaml";
import { BUN_VERSION } from "../../../../../constants/index.ts";
import type { MonorepoConfig } from "../../../../../schemas/index.ts";
import type { HttpsJsonSchemastoreOrgGithubActionJson } from "../../../../../types/github-action.d.ts";
import type { HttpsJsonSchemastoreOrgGithubWorkflowJson } from "../../../../../types/github-workflow.d.ts";

type GithubWorkflowName = "main" | "pull-request" | "update-models";
type GithubWorkflowNameString<
	T extends GithubWorkflowName = GithubWorkflowName,
> = `${T}.yml`;
type GithubWorkflow<T extends GithubWorkflowName = GithubWorkflowName> =
	ReadonlyDeep<
		Record<
			GithubWorkflowNameString<T>,
			Omit<HttpsJsonSchemastoreOrgGithubWorkflowJson, "name"> & {
				readonly name: T;
			}
		>
	>;

type GithubActionName =
	| "prepare-authorized-environment"
	| "bun-install-dependencies";
type GithubActionNameString<T extends GithubActionName = GithubActionName> =
	`${T}/action.yml`;
type GithubAction<T extends GithubActionName = GithubActionName> = ReadonlyDeep<
	Record<GithubActionNameString<T>, HttpsJsonSchemastoreOrgGithubActionJson>
>;

export async function createWorkspaceGithubWorkflows(config: MonorepoConfig) {
	const workflowsDir = ".github/workflows";
	const actionsDir = ".github/actions";
	const CURRENT_NODE_VERSION = (await Bun.$`node --version`.text())
		.trim()
		.replace("v", "")
		.replace("\n", "");

	// Ensure directories exist
	await mkdir(workflowsDir, { recursive: true });
	await mkdir(`${actionsDir}/bun-install-dependencies`, { recursive: true });
	await mkdir(`${actionsDir}/prepare-authorized-environment`, {
		recursive: true,
	});

	// Define workflows in JSON
	const workflows = {
		"main.yml": {
			name: "main",
			on: {
				push: {
					branches: ["main"],
				},
			},
			jobs: {
				lint: {
					"runs-on": "ubuntu-latest",
					steps: [
						{ uses: "actions/checkout@v4" },
						{
							name: "Prepare Environment",
							uses: "./.github/actions/prepare-authorized-environment",
							with: { token: "${{ secrets.GITHUB_TOKEN }}" },
						},
					],
				},
			},
		},
		"pull-request.yml": {
			name: "pull-request",
			on: ["pull_request"],
			jobs: {
				lint: {
					"runs-on": "ubuntu-latest",
					steps: [
						{ uses: "actions/checkout@v4" },
						{
							name: "Prepare Environment",
							uses: "./.github/actions/prepare-authorized-environment",
							with: { token: "${{ secrets.GITHUB_TOKEN }}" },
						},
						{ name: "Lint", run: "bun run lint" },
					],
				},
				generate: {
					"runs-on": "ubuntu-latest",
					steps: [
						{ uses: "actions/checkout@v4" },
						{
							name: "Prepare Environment",
							uses: "./.github/actions/prepare-authorized-environment",
							with: { token: "${{ secrets.GITHUB_TOKEN }}" },
						},
						{ name: "Generate Types", run: "bun run generate" },
					],
				},
				test: {
					"runs-on": "ubuntu-latest",
					steps: [
						{ uses: "actions/checkout@v4" },
						{
							name: "Prepare Environment",
							uses: "./.github/actions/prepare-authorized-environment",
							with: { token: "${{ secrets.GITHUB_TOKEN }}" },
						},
						{ name: "Run Tests", run: "bun run test" },
					],
				},
				docs: {
					"runs-on": "ubuntu-latest",
					steps: [
						{ uses: "actions/checkout@v4" },
						{
							name: "Prepare Environment",
							uses: "./.github/actions/prepare-authorized-environment",
							with: { token: "${{ secrets.GITHUB_TOKEN }}" },
						},
						{ name: "Build Packages and Docs", run: "bun run docs" },
					],
				},
			},
		},
		"update-models.yml": {
			name: "update-models",
			on: {
				schedule: [{ cron: "30 6,14 * * 1-5" }],
				workflow_dispatch: {},
			},
			env: {
				GH_TOKEN: "${{ github.token }}",
			},
			permissions: {
				actions: "write",
				contents: "write",
				"id-token": "write",
				packages: "write",
				"pull-requests": "write",
			},
			jobs: {
				update_models: {
					"runs-on": "ubuntu-latest",
					steps: [
						{ uses: "actions/checkout@v4", with: { "fetch-depth": 0 } },
						{
							name: "Prepare Authorized Environment",
							uses: "./.github/actions/prepare-authorized-environment",
							with: { branch: "main", token: "${{ secrets.GITHUB_TOKEN }}" },
						},
						{
							name: "Generate Models",
							run: "bun run generate",
						},
						{
							name: "Create Pull Request",
							id: "cpr",
							uses: "peter-evans/create-pull-request@v6",
							with: {
								token: "${{ secrets.GITHUB_TOKEN }}",
								"commit-message": "fix: update models",
								labels: "models, automated",
								title: "Update models",
								"delete-branch": true,
								body: `
**Changes:**
- Model updates from the latest version of the API.

**Reason for Automation:**
- This change is automated to ensure models stay in sync with the API.`,
							},
						},
					],
				},
			},
		},
	} as const satisfies GithubWorkflow;

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

	// Write workflows as YAML
	for (const [filename, content] of Object.entries(workflows)) {
		const yamlContent = yaml.stringify(content);
		const path = `${workflowsDir}/${filename}`;
		console.log(`Creating workflow: ${path}`);
		await writeFile(path, yamlContent);
	}

	// Write actions as YAML
	for (const [filename, content] of Object.entries(actions)) {
		const yamlContent = yaml.stringify(content);
		const path = `${actionsDir}/${filename}`;
		console.log(`Creating action: ${path}`);
		await writeFile(path, yamlContent);
	}

	console.log("All workflows and actions have been created successfully.");
}
