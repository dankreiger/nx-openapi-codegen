import type { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import type { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../../constants/index.ts";
import type { MonorepoConfig } from "../monorepo-config/index.ts";

export const SwiftWorkspaceScriptNameSchema = z.enum([
	"swift:generate",
	"swift:release",
	"swift:publish",
]);
export type SwiftWorkspaceScriptName = z.infer<
	typeof SwiftWorkspaceScriptNameSchema
>;

export type SwiftWorkspaceScriptFilePath<
	T extends SwiftWorkspaceScriptName = SwiftWorkspaceScriptName,
> = T extends `swift:${infer A}:${infer B extends string}`
	? `./${typeof BASE_DIR_BY_LANG.swift}/${A}/${B}.ts`
	: T extends `swift:${infer A}`
		? `./${typeof BASE_DIR_BY_LANG.swift}/${A}/index.ts`
		: `./${typeof BASE_DIR_BY_LANG.swift}/${T}/index.ts`;

type SwiftScriptConfig = (config: MonorepoConfig) => Promise<string>;

export type SwiftWorkspaceScripts<
	T extends SwiftWorkspaceScriptName = SwiftWorkspaceScriptName,
> = ReadonlyDeep<Record<SwiftWorkspaceScriptFilePath<T>, SwiftScriptConfig>>;
