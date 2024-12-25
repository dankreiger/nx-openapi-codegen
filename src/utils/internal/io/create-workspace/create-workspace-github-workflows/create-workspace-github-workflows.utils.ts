import { mkdir, writeFile } from "node:fs/promises";
import type { ReadonlyDeep } from "type-fest";
import yaml from "yaml";
import type { MonorepoConfig } from "../../../../../schemas/index.ts";
import type { HttpsJsonSchemastoreOrgGithubWorkflowJson } from "../../../../../types/github-workflow.d.ts";
import { Logger } from "../../logger/index.ts";

type GithubWorkflowName = "main" | "pull-request" | "release" | "update-models";
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

export async function createWorkspaceGithubWorkflows(_: MonorepoConfig) {
	const workflowsDir = ".github/workflows";

	// Ensure directories exist
	await mkdir(workflowsDir, { recursive: true });

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
		"release.yml": {
			name: "release",
			on: ["workflow_dispatch"],
			permissions: {
				actions: "write",
				contents: "write",
				"id-token": "write",
				packages: "write",
			},
			jobs: {
				release: {
					"runs-on": "ubuntu-latest",
					steps: [
						{
							name: "Fail if branch is not main",
							if: "github.ref != 'refs/heads/main'",
							run: 'echo "This workflow should not be triggered with workflow_dispatch on a branch other than main"\nexit 1\n',
						},
						{
							uses: "actions/checkout@v4",
							with: {
								"fetch-depth": 0,
							},
						},
						{
							name: "Prepare Authorized Environment",
							uses: "./.github/actions/prepare-authorized-environment",
							with: {
								branch: "main",
								token: "${{ secrets.GITHUB_TOKEN }}",
							},
						},
						{
							name: "Build packages",
							run: "bun run build",
							shell: "bash",
						},
						{
							name: "Run release",
							run: "bun run release",
							shell: "bash",
							env: {
								NODE_AUTH_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
								GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
							},
						},
					],
				},
			},
		},
		"update-models.yml": {
			name: "update-models",
			on: {
				schedule: [{ cron: "30 6,14 * * 1-5" }],
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
							name: "Notice",
							run: "echo 'Notice: If you have issues with the Create Pull Request, follow these permissions steps: https://stackoverflow.com/questions/72376229/github-actions-is-not-permitted-to-create-or-approve-pull-requests-createpullre'",
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

	// Write workflows as YAML
	for (const [filename, content] of Object.entries(workflows)) {
		const yamlContent = yaml.stringify(content);
		const path = `${workflowsDir}/${filename}`;
		console.log(`Creating workflow: ${path}`);
		await writeFile(path, yamlContent);
	}

	Logger.success("All Github workflows have been created successfully.");
}
