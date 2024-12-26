import type { WorkspaceScripts } from "../../schemas/index.ts";
import { WORKSPACE_KOTLIN_SCRIPT_FILES } from "./kotlin/index.ts";
import { WORKSPACE_SWIFT_SCRIPT_FILES } from "./swift/index.ts";
import { WORKSPACE_TYPESCRIPT_SCRIPT_FILES } from "./typescript/index.ts";

export const WORKSPACE_SCRIPT_FILES = {
	kotlin: WORKSPACE_KOTLIN_SCRIPT_FILES,
	typescript: WORKSPACE_TYPESCRIPT_SCRIPT_FILES,
	swift: WORKSPACE_SWIFT_SCRIPT_FILES,
} as const satisfies WorkspaceScripts;
