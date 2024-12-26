import type { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import type { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../../constants/index.ts";
import type { MonorepoConfig } from "../monorepo-config/index.ts";

export const TypescriptWorkspaceScriptNameSchema = z.enum([
	"typescript:boom",
	"typescript:boom:refresh",
	"typescript:build",
	"typescript:commit",
	"typescript:commit:protect",
	"typescript:docs",
	"typescript:generate",
	"typescript:generate:refresh",
	"typescript:lint",
	"typescript:local-registry:publish",
	"typescript:local-registry:start",
	"typescript:local-registry:stop",
	"typescript:release",
	"typescript:release:dry-run",
	"typescript:release:dry-run-first-time",
	"typescript:release:first-time",
	"typescript:sort",
]);

export type TypescriptWorkspaceScriptName = z.infer<
	typeof TypescriptWorkspaceScriptNameSchema
>;

// Bun doesn't work get with some interactive scripts at the moment
// i.e. when we enter a prompt in the terminal
export type TypescriptNoInteractiveScriptName = Exclude<
	TypescriptWorkspaceScriptName,
	"typescript:commit"
>;

export type TypescriptWorkspaceScriptFilePath<
	T extends
		TypescriptNoInteractiveScriptName = TypescriptNoInteractiveScriptName,
> = T extends `typescript:${infer A}:${infer B extends string}`
	? `./${typeof BASE_DIR_BY_LANG.typescript}/${A}/${B}.ts`
	: T extends `typescript:${infer A}`
		? `./${typeof BASE_DIR_BY_LANG.typescript}/${A}/index.ts`
		: `./${typeof BASE_DIR_BY_LANG.typescript}/${T}/index.ts`;

type TypescriptScriptConfig = (config: MonorepoConfig) => Promise<string>;

export type TypescriptWorkspaceScripts<
	T extends
		TypescriptNoInteractiveScriptName = TypescriptNoInteractiveScriptName,
> = ReadonlyDeep<
	Record<TypescriptWorkspaceScriptFilePath<T>, TypescriptScriptConfig>
>;
