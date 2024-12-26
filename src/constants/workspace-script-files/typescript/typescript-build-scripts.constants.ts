import type { MonorepoConfig } from "../../../schemas/index.ts";
import {
	getNxPackageTags,
	getPackagesNotToBuildString,
} from "../../../utils/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_BUILD_SCRIPTS = {
	/**
	 * Build the workspace
	 *
	 * @param config - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/build/index.ts` as const]: async (
		config: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "nx", "run-many", "--target=build", "--projects=tag:${getNxPackageTags()}", "--exclude=tag:${getPackagesNotToBuildString({ config, outputAs: "string" })}"], { stdout: "inherit" });`,
} as const;
