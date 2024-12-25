import { z } from "zod";

export const PackageScriptNameSchema = z.enum([
	"boom",
	"boom:refresh",
	"build",
	"commit",
	"commit:protect",
	"docs",
	"generate",
	"generate:refresh",
	"lint",
	"local-registry:start",
	"local-registry:publish",
	"local-registry:stop",
	"sort",
	"release",
	"release:dry-run",
	"release:first-time",
	"release:dry-run:first-time",
]);
export type PackageScriptName = z.infer<typeof PackageScriptNameSchema>;

// Bun doesn't work get with some interactive scripts at the moment
export type PackageBunScriptName = Exclude<
	PackageScriptName,
	| "commit"
	| "release"
	| "release:dry-run"
	| "release:first-time"
	| "release:dry-run:first-time"
>;

export type PackageSubpath<T extends PackageBunScriptName> =
	T extends `${infer D}:${infer F}` ? `${D}/${F}.ts` : `${T}/index.ts`;

export const { build, lint, sort } = PackageScriptNameSchema.Enum;
