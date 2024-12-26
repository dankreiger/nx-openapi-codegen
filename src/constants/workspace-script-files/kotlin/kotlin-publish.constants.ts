import type { MonorepoConfig } from "../../../schemas/index.ts";
import type { KotlinWorkspaceScripts } from "../../../schemas/internal/workspace-script-name/kotlin-workspace-script-name.schemas.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const KOTLIN_PUBLISH_SCRIPTS = {
	[`./${BASE_DIR_BY_LANG.kotlin}/publish/index.ts` as const]: async (
		config: MonorepoConfig,
	) =>
		config.byLanguage.kotlin
			? /* ts */ "console.log('TODO: add github actions publish for kotlin')"
			: "",
} as const satisfies KotlinWorkspaceScripts<"kotlin:publish">;
