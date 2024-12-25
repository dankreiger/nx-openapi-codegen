import { z } from "zod";

export const PackageScriptNameSchema = z.enum([
	"boom",
	"boom:refresh",
	"build",
	// "bump:kotlin-version",
	// "bump:swift-version",
	"commit",
	"commit:protect",
	"docs",
	"generate",
	"generate:refresh",
	"lint",
	"local-registry:publish",
	"local-registry:start",
	"local-registry:stop",
	"release",
	"release:dry-run",
	"release:dry-run-first-time",
	"release:first-time",
	"sort",
]);
export type PackageScriptName = z.infer<typeof PackageScriptNameSchema>;

// Bun doesn't work get with some interactive scripts at the moment
export type PackageBunScriptName = Exclude<PackageScriptName, "commit">;

export type PackageSubpath<T extends PackageBunScriptName> =
	T extends `${infer D}:${infer F}` ? `${D}/${F}.ts` : `${T}/index.ts`;

export const { build, lint, sort } = PackageScriptNameSchema.Enum;
