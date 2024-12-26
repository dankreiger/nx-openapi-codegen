import type { MonorepoConfig } from "../../../schemas/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_RELEASE_SCRIPTS = {
	[`./${BASE_DIR_BY_LANG.typescript}/release/index.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
process.env.LEFTHOOK = "0";
Bun.spawnSync(["bunx", "nx", "release", "-y"], { stdout: "inherit" });`,

	[`./${BASE_DIR_BY_LANG.typescript}/release/first-time.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
process.env.LEFTHOOK = "0";
Bun.spawnSync(["bunx", "nx", "release", "--first-release", "-y"], { stdout: "inherit" });`,

	[`./${BASE_DIR_BY_LANG.typescript}/release/dry-run.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
process.env.LEFTHOOK = "0";
Bun.spawnSync(["bunx", "nx", "release", "--dry-run", "--skip-publish", "-y"], { stdout: "inherit" });`,

	[`./${BASE_DIR_BY_LANG.typescript}/release/dry-run-first-time.ts` as const]:
		async (_: MonorepoConfig) =>
			/* ts */ `${"#!/usr/bin/env bun"}
process.env.LEFTHOOK = "0";
Bun.spawnSync(["bunx", "nx", "release", "--first-release", "--dry-run", "--skip-publish", "-y"], { stdout: "inherit" });`,
} as const;
