import type { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import type { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../../constants/index.ts";
import type { MonorepoConfig } from "../monorepo-config/index.ts";

export const KotlinWorkspaceScriptNameSchema = z.enum([
	"kotlin:generate",
	"kotlin:release",
	"kotlin:publish",
]);
export type KotlinWorkspaceScriptName = z.infer<
	typeof KotlinWorkspaceScriptNameSchema
>;

export type KotlinWorkspaceScriptFilePath<
	T extends KotlinWorkspaceScriptName = KotlinWorkspaceScriptName,
> = T extends `kotlin:${infer A}:${infer B extends string}`
	? `./${typeof BASE_DIR_BY_LANG.kotlin}/${A}/${B}.ts`
	: T extends `kotlin:${infer A}`
		? `./${typeof BASE_DIR_BY_LANG.kotlin}/${A}/index.ts`
		: `./${typeof BASE_DIR_BY_LANG.kotlin}/${T}/index.ts`;

type ScriptConfig = (config: MonorepoConfig) => Promise<string>;

export type KotlinWorkspaceScripts<
	T extends KotlinWorkspaceScriptName = KotlinWorkspaceScriptName,
> = ReadonlyDeep<Record<KotlinWorkspaceScriptFilePath<T>, ScriptConfig>>;
