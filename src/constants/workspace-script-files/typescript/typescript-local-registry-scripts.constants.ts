import type { MonorepoConfig } from "../../../schemas/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_LOCAL_REGISTRY_SCRIPTS = {
	/**
	 * Start the local registry
	 *
	 * @param _ - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/local-registry/start.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "verdaccio"], { stdout: "inherit" });`,

	/**
	 * Publish the local registry
	 *
	 * @param _ - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/local-registry/publish.ts` as const]:
		async (_: MonorepoConfig) =>
			/* ts */ `${"#!/usr/bin/env bun"}
const registry = "http://localhost:4873";

Bun.spawnSync(["npm", "config", "set", "registry", registry], { stdout: "inherit" });
Bun.spawnSync(["bun", "run", "typescript:build"], { stdout: "inherit" });
Bun.spawnSync([
	"bunx", 
	"nx",
	"release",
	"publish",
	"--registry", 
	registry,
	"--tag",
	"latest"
], { stdout: "inherit" });
Bun.spawnSync(["npm", "config", "set", "registry", "https://registry.npmjs.org"], { stdout: "inherit" });`,

	/**
	 * Stop the local registry
	 *
	 * @param _ - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/local-registry/stop.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "pm2", "stop", "verdaccio"], { stdout: "inherit" });
Bun.spawnSync(["bunx", "pm2", "delete", "verdaccio"], { stdout: "inherit" });`,
} as const;
