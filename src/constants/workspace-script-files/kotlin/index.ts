import type { KotlinWorkspaceScripts } from "../../../schemas/internal/workspace-script-name/kotlin-workspace-script-name.schemas.ts";
import { KOTLIN_GENERATE_SCRIPTS } from "./kotlin-generate.constants.ts";
import { KOTLIN_PUBLISH_SCRIPTS } from "./kotlin-publish.constants.ts";
import { KOTLIN_RELEASE_SCRIPTS } from "./kotlin-release.constants.ts";
export const WORKSPACE_KOTLIN_SCRIPT_FILES = {
	...KOTLIN_GENERATE_SCRIPTS,
	...KOTLIN_RELEASE_SCRIPTS,
	...KOTLIN_PUBLISH_SCRIPTS,
} as const satisfies KotlinWorkspaceScripts;
