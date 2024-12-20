import type { Join } from "type-fest";

export function getNxPackageTags<const T extends ReadonlyArray<string>>(
	tags?: T,
) {
	return ["typescript", ...(tags ?? [])].join(",") as TypeScriptProjectTags<T>;
}

type TypeScriptProjectTags<T> =
	`typescript,${T extends ReadonlyArray<string> ? Join<T, ","> : ""}`;
