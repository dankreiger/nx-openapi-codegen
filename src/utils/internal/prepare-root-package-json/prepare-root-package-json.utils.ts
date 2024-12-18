import { $ } from "bun";


export async function prepareRootPackageJson() {
	const path = `${process.cwd()}/package.json`;
	const file = Bun.file(path);

	const contents = await file.json();
	contents.scripts.lint =
		"bunx nx run-many --target=biome-lint --projects=typescript";

	await $`bunx sort-package-json`;
}
