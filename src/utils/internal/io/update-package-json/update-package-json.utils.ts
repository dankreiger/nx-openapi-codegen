import { $, write } from "bun";
import { merge } from "lodash-es";
import type { PackageJson } from "type-fest";

export async function updatePackageJson(input: {
	packageJsonOverride?: Partial<PackageJson.PackageJsonStandard> & {
		sideEffects?: boolean;
		module?: string;
		types?: string;
		overrides?: Record<string, string>;
	};
	path?: string;
}) {
	const { packageJsonOverride, path = `${process.cwd()}/package.json` } = input;
	const file = Bun.file(path);

	const contents = await file.json();

	await write(
		path,
		JSON.stringify(merge(contents, packageJsonOverride), null, 2),
	);

	await $`bunx sort-package-json ${path}`;
}
