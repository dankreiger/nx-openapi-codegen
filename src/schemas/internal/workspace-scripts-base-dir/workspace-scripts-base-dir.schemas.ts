import { z } from "zod";
import { WORKSPACE_SCRIPTS_BASE_DIR } from "../../../constants";
import type { PackageScriptName, PackageSubpath } from "../package-script-name";

export const WorkspaceScriptsBaseDirSchema = z.literal(
	WORKSPACE_SCRIPTS_BASE_DIR,
);

export type WorkspaceScriptsPath =
	`./${z.infer<typeof WorkspaceScriptsBaseDirSchema>}/${PackageSubpath<PackageScriptName>}`;
