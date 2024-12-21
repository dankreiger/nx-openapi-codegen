import { $, write } from "bun";

import {
	DEPENDENCIES,
	WORKSPACE_BIOME_CONFIG,
} from "../../../../constants/index.ts";
import type {
	MonorepoConfig,
	PackageScriptName,
} from "../../../../schemas/index.ts";
import { getGithubRepoUrl } from "../../mappers/get-github-repo-url/index.ts";
import { updatePackageJson } from "../update-package-json/index.ts";
import { createWorkspaceCodegenConfig } from "./create-workspace-codegen-config/index.ts";
import { createWorkspaceCommitConfig } from "./create-workspace-commit-config/index.ts";
import { createWorkspaceNpmrc } from "./create-workspace-npmrc/index.ts";
import { createWorkspaceScripts } from "./create-workspace-scripts/index.ts";
import { createWorkspaceVscodeConfig } from "./create-workspace-vscode-config/index.ts";

export async function createWorkspace(config: MonorepoConfig) {
	const { githubRepoName } = config;

	await $`bunx create-nx-workspace@20.2.2 ${githubRepoName} \
    --preset=ts \
    --formatter=none \
    --linter=none \
    --strict=true \
    --nxCloud=skip \
    --pm=bun \
    --useGitHub=true`;

	process.chdir(githubRepoName);
	await Bun.$`bunx nx reset`;

	// Prepare root package.json
	await updatePackageJson({
		packageJsonOverride: {
			config: {
				commitizen: {
					path: "./node_modules/cz-conventional-changelog",
				},
			},
			homepage: getGithubRepoUrl(config),
			publishConfig: {
				[`${config.githubOrgName}:registry`]: "https://npm.pkg.github.com",
			},
			repository: {
				type: "git",
				url: getGithubRepoUrl(config),
			},
			overrides: {
				esbuild: "0.24.0",
				react: "18.3.1",
				"react-dom": "18.3.1",
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
			devDependencies: DEPENDENCIES,
		},
	});

	// Create workspace scripts
	await createWorkspaceScripts(config);

	// Create commit config
	await createWorkspaceCommitConfig();

	// Create code generator config
	await createWorkspaceCodegenConfig(config);

	// Create npmrc
	await createWorkspaceNpmrc(config);

	// Create vscode config
	await createWorkspaceVscodeConfig();

	// Set biome config
	await write("biome.json", JSON.stringify(WORKSPACE_BIOME_CONFIG, null, 2));

	// Set bun version
	await write(".bun-version", "1.1.39");

	// Set NX env vars
	await write(
		".env",
		`NX_SKIP_NX_CACHE=true
NX_VERBOSE_LOGGING=true
`,
	);
}
