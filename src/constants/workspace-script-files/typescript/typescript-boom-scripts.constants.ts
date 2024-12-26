import type { MonorepoConfig } from "../../../schemas/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_BOOM_SCRIPTS = {
	/**
	 * Clean up the workspace
	 *
	 * @param _ - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/boom/index.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
console.log("Finding and removing all node_modules and dist directories...");
Bun.spawnSync(["find", ".", "-name", "node_modules", "-type", "d", "-prune", "-print", "-exec", "rm", "-rf", "{}", "+"], { stdout: "inherit" });
Bun.spawnSync(["find", ".", "-name", "dist", "-type", "d", "-prune", "-print", "-exec", "rm", "-rf", "{}", "+"], { stdout: "inherit" });

console.log("Removing transient files...");
Bun.spawnSync(["bunx", "rimraf", "tmp"], { stdout: "inherit" });      // tmp files
Bun.spawnSync(["bunx", "rimraf", "docs"], { stdout: "inherit" });     // typedoc
Bun.spawnSync(["bunx", "rimraf", "coverage"], { stdout: "inherit" }); // jest coverage
Bun.spawnSync(["bunx", "rimraf", "target"], { stdout: "inherit" });   // rust
Bun.spawnSync(["bunx", "rimraf", ".nx"], { stdout: "inherit" });      // nx cache

console.log("Cleanup complete.");`,

	/**
	 * Refresh the workspace
	 *
	 * Which means:
	 * - Run the boom script
	 * - Remove the bun.lockb file
	 * - Remove the .nx directory
	 *
	 * @param _ - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/boom/refresh.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bun", "run", "typescript:boom"], { stdout: "inherit" });
Bun.spawnSync(["bun", "pm", "cache", "rm"], { stdout: "inherit" });
Bun.spawnSync(["rm", "bun.lockb"], { stdout: "inherit" });
Bun.spawnSync(["bun", "install"], { stdout: "inherit" });`,
} as const;
