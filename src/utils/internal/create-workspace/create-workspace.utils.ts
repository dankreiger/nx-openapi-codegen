import { $, write } from "bun";

import type { MonorepoConfig, PackageScriptName } from "../../../schemas";
import { createWorkspaceCommitConfig } from "../create-workspace-commit-config";
import { createWorkspaceNpmrc } from "../create-workspace-npmrc";
import { createWorkspaceScripts } from "../create-workspace-scripts";
import { createWorkspaceVscodeConfig } from "../create-workspace-vscode-config";
import { getGithubRepoUrl } from "../get-github-repo-url";
import { updatePackageJson } from "../update-package-json";

export async function createWorkspace(config: MonorepoConfig) {
	const { repoName } = config;

	await $`bunx create-nx-workspace@latest ${repoName} \
    --preset=ts \
    --formatter=none \
    --linter=none \
    --strict=true \
    --nxCloud=skip \
    --pm=bun \
    --useGitHub=true`;

	process.chdir(repoName);

	// Run the untrusted command to install the packages
	await $`bun pm untrusted`;

	// Add @nx/js to the workspace
	await $`bunx nx add @nx/js --save-exact`;

	// Install dev dependencies
	const DEV_DEPENDENCIES = [
		"@gitopslovers/nx-biome",
		"@nx/devkit",
		"@commitlint/cli",
		"@commitlint/config-conventional",
		"@commitlint/prompt-cli",
		"lefthook",
		"tslib",
		"tsup",
		"commitizen",
		"cz-conventional-changelog",
	];
	await $`bun add -D -E ${{ raw: DEV_DEPENDENCIES.join(" ") }}`;

	// Prepare root package.json
	await updatePackageJson({
		packageJsonOverride: {
			commitlint: {
				extends: ["@commitlint/config-conventional"],
			},
			config: {
				commitizen: {
					path: "./node_modules/cz-conventional-changelog",
				},
			},
			homepage: getGithubRepoUrl(config),
			publishConfig: {
				[`${config.npmOrgName}:registry`]: "https://npm.pkg.github.com",
			},
			repository: {
				type: "git",
				url: getGithubRepoUrl(config),
			},
			scripts: {
				build: "bun ./tools/scripts/build/index.ts",
				boom: "bun ./tools/scripts/boom/index.ts",
				"boom:refresh": "bun ./tools/scripts/boom/refresh.ts",
				commit: "bun ./tools/scripts/commit/index.ts",
				"commit:protect": "bun ./tools/scripts/commit/protect.ts",
				docs: "bun ./tools/scripts/docs/index.ts",
				generate: "bun ./tools/scripts/generate/index.ts",
				"generate:refresh": "bun ./tools/scripts/generate/refresh.ts",
				lint: "bun ./tools/scripts/lint/index.ts",
				"local-registry:start": "bun ./tools/scripts/local-registry/start.ts",
				"local-registry:publish":
					"bun ./tools/scripts/local-registry/publish.ts",
				"local-registry:stop": "bun ./tools/scripts/local-registry/stop.ts",
				sort: "bun ./tools/scripts/sort/index.ts",
				release: "bun ./tools/scripts/release/index.ts",
				"release:dry-run": "bun ./tools/scripts/release/dry-run.ts",
			} satisfies Readonly<Record<PackageScriptName, string>>,
		},
	});

	// Create workspace scripts
	await createWorkspaceScripts();

	// Create commit config
	await createWorkspaceCommitConfig();

	// Create npmrc
	await createWorkspaceNpmrc(config);

	// Create vscode config
	await createWorkspaceVscodeConfig();

	// Set bun version
	await write(".bun-version", "1.1.39");
}
