import type { MonorepoConfig } from "../../../schemas/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_LINT_SCRIPTS = {
	[`./${BASE_DIR_BY_LANG.typescript}/lint/index.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
  Bun.spawnSync(["biome", "lint", "--write", "--unsafe"], { stdout: "inherit" });`,
} as const;
