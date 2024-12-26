import type { MonorepoConfig } from "../../../schemas/index.ts";
import { getNxPackageTags } from "../../../utils/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_SORT_SCRIPTS = {
	[`./${BASE_DIR_BY_LANG.typescript}/sort/index.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "nx", "run-many", "--target=sort", "--projects=tag:${getNxPackageTags()}"], { stdout: "inherit" });`,
} as const;
