import type { MonorepoConfig } from "../../../schemas/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_COMMIT_SCRIPTS = {
	/**
	 * Protect the main branch from direct commits
	 *
	 * @param _ - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/commit/protect.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
const currentBranch = (Bun.spawnSync(["git", "rev-parse", "--abbrev-ref", "HEAD"], {
  stdout: "pipe",
}).stdout.text()).trim();

if (currentBranch === "main" && !process.env.CI) {
  console.log("\\n\\x1b[41m\\x1b[97m===========================================================================\\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m ERROR: Direct commits to the 'main' branch are prohibited!                \\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m Please switch to a feature branch for your changes.                       \\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m Use 'git checkout -b <branch-name>' to create and switch to a new branch. \\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m===========================================================================\\x1b[0m\\n\\n");
  process.exit(1);
}

console.log(\`Committing to \${currentBranch}\`);`,
} as const;
