import { pipe, tap } from "async-toolbelt";
import type { MonorepoConfig } from "../../../../schemas/index.ts";
import { Logger } from "../logger/logger.utils.ts";
import { createWorkspaceBiomeConfig } from "./create-workspace-biome-config/index.ts";
import { createWorkspaceBunVersion } from "./create-workspace-bun-version/index.ts";
import { createWorkspaceCommitConfig } from "./create-workspace-commit-config/index.ts";
import { createWorkspaceGithubActions } from "./create-workspace-github-actions/index.ts";
import { createWorkspaceGithubWorkflows } from "./create-workspace-github-workflows/index.ts";
import { createWorkspaceNpmrc } from "./create-workspace-npmrc/index.ts";
import { createWorkspaceNxConfig } from "./create-workspace-nx-config/index.ts";
import { createWorkspaceNx } from "./create-workspace-nx/index.ts";
import { createWorkspacePackageJson } from "./create-workspace-package-json/index.ts";
import { createWorkspaceScripts } from "./create-workspace-scripts/index.ts";
import { createWorkspaceVscodeConfig } from "./create-workspace-vscode-config/index.ts";

export async function createWorkspace(config: MonorepoConfig) {
	return pipe(
		config,
		tap(createWorkspaceNx),
		tap(createWorkspacePackageJson),
		tap(createWorkspaceScripts),
		tap(createWorkspaceCommitConfig),
		tap(createWorkspaceBunVersion),
		tap(createWorkspaceNpmrc),
		tap(createWorkspaceVscodeConfig),
		tap(createWorkspaceBiomeConfig),
		tap(createWorkspaceNxConfig),
		tap(createWorkspaceGithubWorkflows),
		tap(createWorkspaceGithubActions),
		tap(() => Logger.success("Done creating workspace")),
	);
}
