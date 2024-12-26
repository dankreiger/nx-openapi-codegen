import type { MonorepoConfig } from "../../../schemas/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_DOCS_SCRIPTS = {
	/**
	 * Generate TypeScript documentation
	 *
	 * @param _ - The monorepo config
	 * @returns The script content
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/docs/index.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
await Bun.$\`bunx typedoc\`;
export {}`,
} as const;
