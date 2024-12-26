import { z } from "zod";
import {
	type KotlinWorkspaceScriptName,
	KotlinWorkspaceScriptNameSchema,
	type KotlinWorkspaceScripts,
} from "./kotlin-workspace-script-name.schemas.ts";
import {
	type SwiftWorkspaceScriptName,
	SwiftWorkspaceScriptNameSchema,
	type SwiftWorkspaceScripts,
} from "./swift-workspace-script-name.schemas.ts";
import {
	type TypescriptWorkspaceScriptName,
	TypescriptWorkspaceScriptNameSchema,
	type TypescriptWorkspaceScripts,
} from "./typescript-workspace-script-name.schemas.ts";

export type WorkspaceScripts = Readonly<{
	kotlin: KotlinWorkspaceScripts;
	swift: SwiftWorkspaceScripts;
	typescript: TypescriptWorkspaceScripts;
}>;

export type WorkspaceScriptName =
	| KotlinWorkspaceScriptName
	| SwiftWorkspaceScriptName
	| TypescriptWorkspaceScriptName;

export const WorkspaceScriptNameSchema = z.union([
	KotlinWorkspaceScriptNameSchema,
	SwiftWorkspaceScriptNameSchema,
	TypescriptWorkspaceScriptNameSchema,
]);
