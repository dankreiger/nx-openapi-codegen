import type { TypescriptWorkspaceScripts } from "../../../schemas/internal/workspace-script-name/typescript-workspace-script-name.schemas.ts";
import { TYPESCRIPT_BOOM_SCRIPTS as BOOM } from "./typescript-boom-scripts.constants.ts";
import { TYPESCRIPT_BUILD_SCRIPTS as BUILD } from "./typescript-build-scripts.constants.ts";
import { TYPESCRIPT_COMMIT_SCRIPTS as COMMIT } from "./typescript-commit-scripts.constants.ts";
import { TYPESCRIPT_DOCS_SCRIPTS as DOCS } from "./typescript-docs-scripts.constants.ts";
import { TYPESCRIPT_GENERATE_SCRIPTS as GENERATE } from "./typescript-generate.constants.ts";
import { TYPESCRIPT_LINT_SCRIPTS as LINT } from "./typescript-lint-scripts.constants.ts";
import { TYPESCRIPT_LOCAL_REGISTRY_SCRIPTS as LOCAL_REGISTRY } from "./typescript-local-registry-scripts.constants.ts";
import { TYPESCRIPT_RELEASE_SCRIPTS as RELEASE } from "./typescript-release-scripts.constants.ts";
import { TYPESCRIPT_SORT_SCRIPTS as SORT } from "./typescript-sort-scripts.constants.ts";

export const WORKSPACE_TYPESCRIPT_SCRIPT_FILES = {
	/** Scripts for handling catastrophic failures and emergency procedures */
	...BOOM,
	/** Scripts for building TypeScript packages and related build processes */
	...BUILD,
	/** Scripts for managing git commits and commit-related operations */
	...COMMIT,
	/** Scripts for generating and managing documentation */
	...DOCS,

	/** Scripts for code generation and scaffolding */
	...GENERATE,

	/** Scripts for linting and code style enforcement */
	...LINT,

	/** Scripts for managing local package registry operations */
	...LOCAL_REGISTRY,

	/** Scripts for handling package releases and versioning */
	...RELEASE,

	/** Scripts for sorting and organizing package contents */
	...SORT,
} as const satisfies TypescriptWorkspaceScripts;
