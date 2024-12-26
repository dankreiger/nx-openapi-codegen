import type { MonorepoConfig } from "../../../schemas/index.ts";
import type { SwiftWorkspaceScripts } from "../../../schemas/internal/workspace-script-name/swift-workspace-script-name.schemas.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const SWIFT_RELEASE_SCRIPTS = {
	[`./${BASE_DIR_BY_LANG.swift}/release/index.ts` as const]: async (
		config: MonorepoConfig,
	) =>
		config.byLanguage.swift
			? /* ts */ "console.log('TODO: add github actions release for swift')"
			: "",
} as const satisfies SwiftWorkspaceScripts<"swift:release">;
