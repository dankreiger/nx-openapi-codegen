import type { SdkLanguage } from "../schemas/index.ts";

export const WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG = {
	typescript: "tools/scripts/typescript",
	kotlin: "tools/scripts/kotlin",
	swift: "tools/scripts/swift",
} as const satisfies Record<SdkLanguage, string>;
