import { $, write } from "bun";
import { TSUP_CONFIG } from "../../../constants";
import type { MonorepoConfig } from "../../../types";
import { getTags } from "../get-tags";
import { preparePackageJson } from "../prepare-package-json";

export async function createPackage(config: MonorepoConfig) {
	const { npmOrgName, packagesBaseDir, selectedPackages, repoName } = config;

	for (const folder of selectedPackages) {
		const PACKAGE_NAME = `${npmOrgName}/${folder}` as const;
		const DIRECTORY = `${packagesBaseDir}/${folder}`;
		const ORG_NAME = npmOrgName.replace("@", "");
		const GITHUB_REPO_PATH = `https://github.com/${ORG_NAME}/${repoName}.git`;
		console.log(
			`\nGenerating library for: ${folder} with prefix: ${npmOrgName}\n`,
		);

		await $`bunx nx generate @nx/js:library \
      --directory=${DIRECTORY} \
      --importPath=${PACKAGE_NAME} \
      --name=${PACKAGE_NAME} \
      --publishable=true \
      --unitTestRunner=none \
      --linter=none \
      --tags=${getTags([folder])} \
      --no-interactive`;

		await $`bun pm untrusted`;
		await $`bunx nx g @gitopslovers/nx-biome:configuration --project ${PACKAGE_NAME}`;

		await preparePackageJson({
			packageJsonOverride: {
				description: "Type definitions for the models and schemas.",
				homepage: GITHUB_REPO_PATH,
				repository: {
					type: "git",
					url: GITHUB_REPO_PATH,
					directory: `${DIRECTORY}/${folder}`,
				},
				license: "MIT",
				sideEffects: false,
				main: "./dist/index.js",
				module: "./dist/index.mjs",
				types: "./dist/index.d.ts",
				files: ["dist/**"],
				scripts: {
					build: `${folder === "types" ? "" : "tsup src/index.ts  &&"} bun dts`,
					dts: "bunx tsc --emitDeclarationOnly --project tsconfig.lib.json",
					format: "sort-package-json",
				},
			},
			path: `${DIRECTORY}/package.json`,
		});

		await write(`${DIRECTORY}/tsup.config.ts`, TSUP_CONFIG);

		console.log(`\nDone generating: ${folder}`);
	}
}
