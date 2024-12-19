import { $, write } from "bun";
import chalk from "chalk";
import { PACKAGE_TSUP_CONFIG } from "../../../constants";
import type { MonorepoConfig } from "../../../schemas";
import { getGithubRepoUrl } from "../get-github-repo-url";
import { getPackageDescriptionByFolder } from "../get-package-description-by-folder";
import { getTags } from "../get-tags";
import { updatePackageJson } from "../update-package-json";

export async function createPackage(config: MonorepoConfig) {
	const { npmOrgName, packagesBaseDir, selectedPackages, repoName } = config;

	for (const folder of selectedPackages) {
		const PACKAGE_NAME = `${npmOrgName}/${folder}` as const;
		const DIRECTORY = `${packagesBaseDir}/${folder}`;
		const ORG_NAME = npmOrgName.replace("@", "");
		const GITHUB_REPO_PATH = `https://github.com/${ORG_NAME}/${repoName}.git`;
		console.log(
			chalk.blue(
				`\n⚡ Generating library for: ${chalk.bold.white(folder)} with prefix: ${chalk.bold.white(npmOrgName)}\n`,
			),
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

		await updatePackageJson({
			packageJsonOverride: {
				description: getPackageDescriptionByFolder(folder),
				homepage: getGithubRepoUrl(config),
				repository: {
					type: "git",
					url: getGithubRepoUrl(config),
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

		await write(`${DIRECTORY}/tsup.config.ts`, PACKAGE_TSUP_CONFIG);

		console.log(
			chalk.green(`\n✓ Done generating: ${chalk.bold.white(PACKAGE_NAME)}`),
		);
		console.log(`\t Details: ${getPackageDescriptionByFolder(folder)}`);
	}
}
