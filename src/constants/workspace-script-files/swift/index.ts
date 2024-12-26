import type { SwiftWorkspaceScripts } from "../../../schemas/internal/workspace-script-name/swift-workspace-script-name.schemas.ts";
import { SWIFT_GENERATE_SCRIPTS } from "./swift-generate.constants.ts";
import { SWIFT_PUBLISH_SCRIPTS } from "./swift-publish.constants.ts";
import { SWIFT_RELEASE_SCRIPTS } from "./swift-release.constants.ts";

export const WORKSPACE_SWIFT_SCRIPT_FILES = {
	...SWIFT_GENERATE_SCRIPTS,
	...SWIFT_RELEASE_SCRIPTS,
	...SWIFT_PUBLISH_SCRIPTS,
} as const satisfies SwiftWorkspaceScripts;
