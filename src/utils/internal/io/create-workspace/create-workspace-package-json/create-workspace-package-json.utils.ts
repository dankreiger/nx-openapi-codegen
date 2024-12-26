import { values } from "strong-object";
import {
	DEPENDENCIES,
	WORKSPACE_PACKAGE_JSON_SCRIPTS,
} from "../../../../../constants/index.js";
import type {
	MonorepoConfig,
	WorkspaceScriptName,
} from "../../../../../schemas/index.js";
import {
	type WorkspacePackageJsonScriptConfig,
	type WorkspacePackageJsonScriptValue,
	WorkspacePackageJsonScriptValueSchema,
} from "../../../../../schemas/internal/workspace-package-json-script-config/workspace-package-json-script-config.schemas.js";
import { getGithubRepoUrl } from "../../../mappers/get-github-repo-url/index.js";
import { updatePackageJson } from "../../update-package-json/index.js";

const buildScripts = (
	scripts: ReadonlyArray<WorkspacePackageJsonScriptConfig>,
) =>
	scripts.reduce(
		(acc, cur) => {
			acc[cur.name] = WorkspacePackageJsonScriptValueSchema.parse(cur);
			return acc;
		},
		{} as Record<WorkspaceScriptName, WorkspacePackageJsonScriptValue>,
	);

const buildWorkspaces = (config: MonorepoConfig): string[] => {
	const directories = values(config.byLanguage).filter(Boolean);

	if (directories.length === 0) {
		throw new Error(
			"No valid language directories found in 'byLanguage' object",
		);
	}

	return directories.filter(Boolean).map((dir) => {
		if (!dir?.packagesDirectoryPath) {
			throw new Error(
				"No packages directory path found in 'byLanguage' object",
			);
		}

		return `${dir.packagesDirectoryPath}/**/*`;
	});
};

export async function createWorkspacePackageJson(
	config: MonorepoConfig,
): Promise<void> {
	await updatePackageJson({
		packageJsonOverride: {
			config: {
				commitizen: {
					path: "./node_modules/cz-conventional-changelog",
				},
			},
			devDependencies: DEPENDENCIES,
			homepage: getGithubRepoUrl(config),
			overrides: {
				esbuild: "0.24.0",
				react: "18.3.1",
				"react-dom": "18.3.1",
			},
			publishConfig: {
				[`${config.npmOrgScope}:registry`]: "https://npm.pkg.github.com",
			},
			repository: {
				type: "git",
				url: getGithubRepoUrl(config),
			},
			scripts: buildScripts(WORKSPACE_PACKAGE_JSON_SCRIPTS),
			version: "0.0.1",
			workspaces: buildWorkspaces(config),
		},
	});
}
