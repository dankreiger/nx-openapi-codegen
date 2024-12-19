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
]);
export type PackageScriptName = z.infer<typeof PackageScriptNameSchema>;

export type PackageSubpath<T extends PackageScriptName> =
	T extends `${infer D}:${infer F}` ? `${D}/${F}.ts` : `${T}/index.ts`;

export const { build, lint, sort } = PackageScriptNameSchema.Enum;
