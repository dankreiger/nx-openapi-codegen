import { merge } from "lodash-es";
import type { PackageJson } from "type-fest";

export async function updatePackageJson(input: {
	packageJsonOverride?: Partial<PackageJson.PackageJsonStandard> & {
		sideEffects?: boolean;
		module?: string;
		types?: string;
		overrides?: Record<string, string>;
	};
	packageJsonPath?: string;
}) {
	const {
		packageJsonOverride,
		packageJsonPath = `${process.cwd()}/package.json`,
	} = input;
	const file = Bun.file(packageJsonPath);

	const contents = await file.json();

	await Bun.write(
		packageJsonPath,
		JSON.stringify(merge(contents, packageJsonOverride), null, 2),
	);

	await Bun.spawnSync(["bunx", "sort-package-json", packageJsonPath], {
		stdout: "inherit",
	});
	await Bun.spawnSync(["bun", "install"], { stdout: "inherit" });
}
