import { values } from "strong-object";
import { DEPENDENCIES } from "../../../../../constants/index.ts";
import type {
	MonorepoConfig,
	PackageScriptName,
} from "../../../../../schemas/index.ts";
import { getGithubRepoUrl } from "../../../mappers/get-github-repo-url/index.ts";
import { updatePackageJson } from "../../update-package-json/index.ts";

export async function createWorkspacePackageJson(config: MonorepoConfig) {
	await updatePackageJson({
		packageJsonOverride: {
			workspaces: values(config.byLanguage)
				.filter(Boolean)
				.map((dir) => {
					if (!dir) {
						throw new Error("No language found in 'byLanguage' object");
					}
					return `${dir.packagesDirectoryPath}/**/*`;
				}),
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
				boom: "bun --bun ./tools/scripts/boom/index.ts",
				"boom:refresh": "bun --bun ./tools/scripts/boom/refresh.ts",
				commit: "bun --bun ./tools/scripts/commit/index.ts",
				"commit:protect": "bun --bun ./tools/scripts/commit/protect.ts",
				docs: "bun --bun ./tools/scripts/docs/index.ts",
				generate: "bun --bun ./tools/scripts/generate/index.ts",
				"generate:refresh": "bun --bun ./tools/scripts/generate/refresh.ts",
				lint: "bun --bun ./tools/scripts/lint/index.ts",
				"local-registry:start":
					"bun --bun ./tools/scripts/local-registry/start.ts",
				"local-registry:publish":
					"bun ./tools/scripts/local-registry/publish.ts",
				"local-registry:stop":
					"bun --bun ./tools/scripts/local-registry/stop.ts",
				sort: "bun --bun ./tools/scripts/sort/index.ts",
				release: "bun --bun ./tools/scripts/release/index.ts",
				"release:dry-run": "bun --bun ./tools/scripts/release/dry-run.ts",
			} satisfies Readonly<Record<PackageScriptName, string>>,
			devDependencies: DEPENDENCIES,
		},
	});
}
