import { $, write } from "bun";
import chalk from "chalk";
import {
	PACKAGE_TSUP_CONFIG_JSON,
	getPackageTsupConfigString,
} from "../../../../constants/index.ts";
import {
	type AvailablePackages,
	AvailablePackagesSchema,
	type MonorepoConfig,
} from "../../../../schemas/index.ts";
import {
	getGithubRepoUrl,
	getNxPackageTags,
	getPackageDescriptionByFolder,
	getPeerDepByFolder,
} from "../../mappers/index.ts";
import { Logger } from "../logger/index.ts";
import { updatePackageJson } from "../update-package-json/index.ts";
import { updateTsconfigJson } from "../update-tsconfig-json/index.ts";

export async function createPackages(config: MonorepoConfig) {
	for (const folder of config.selectedPackages) {
		const PACKAGE_NAME = `${config.npmOrgScope}/${folder}` as const;
		const DIRECTORY = `${config.packagesBaseDirPath}/${folder}`;
		console.log(
			chalk.blue(
				`\n⚡ Generating library for: ${chalk.bold.white(folder)} with prefix: ${chalk.bold.white(config.githubOrgName)}\n`,
			),
		);

		await $`bunx nx reset && bunx nx add @nx/js`;

		await $`bunx nx generate @nx/js:library \
      --directory=${DIRECTORY} \
      --importPath=${PACKAGE_NAME} \
      --name=${PACKAGE_NAME} \
      --unitTestRunner=none \
      --linter=none \
			--useProjectJson=false \
      --tags=${getNxPackageTags([folder])} \
      --publishable=true \
			--skipFormat=true \
      --no-interactive`;

		if (folder === "oas") {
			await Bun.write(`${DIRECTORY}/src/index.ts`, "export {}");
		}

		for await (const currentTsconfigPath of [
			"tsconfig.json",
			"tsconfig.lib.json",
		] as const) {
			await updateTsconfigJson({
				tsconfigPath: `${DIRECTORY}/${currentTsconfigPath}`,
				transform: (tsconfigJson) => ({
					extends: tsconfigJson.extends,
					compilerOptions: {
						...tsconfigJson.compilerOptions,
						allowImportingTsExtensions: true,
					},
				}),
			});
		}

		await updatePackageJson({
			skipInstall: true,
			packageJsonPath: `${DIRECTORY}/package.json`,
			packageJsonOverride: {
				description: getPackageDescriptionByFolder(folder),
				homepage: getGithubRepoUrl(config),
				repository: {
					type: "git",
					url: getGithubRepoUrl(config),
					directory: DIRECTORY,
				},
				license: "MIT",
				sideEffects: false,
				type: "module",
				exports: {
					".": {
						import: {
							types: "./dist/index.d.ts",
							default: "./dist/index.js",
						},
						require: {
							types: "./dist/index.d.cts",
							default: "./dist/index.cjs",
						},
					},
					"./package.json": "./package.json",
					"./*": "./*",
				},
				main: "dist/index.cjs",
				module: "dist/index.js",
				types: "./dist/index.d.ts",
				files: ["dist/**"],
				scripts: {
					build: `${isPackageBlockedFromBuilding(folder) ? `echo ${folder} is blocked from building` : "tsup"}`,
					sort: "bunx sort-package-json",
					typecheck:
						"tsc -p ./tsconfig.json --noEmit --emitDeclarationOnly false",
				},
				engines: {
					node: ">=22",
				},
				peerDependencies: getPeerDepByFolder(folder),
			},
		});

		// Write tsup config
		await write(
			`${DIRECTORY}/tsup.config.ts`,
			getPackageTsupConfigString(PACKAGE_TSUP_CONFIG_JSON),
		);

		await Bun.$`rm -rf ${DIRECTORY}/src/lib`;

		Logger.doneGenerating(PACKAGE_NAME);
		console.log(`\t Details: ${getPackageDescriptionByFolder(folder)}`);
	}

	await Bun.spawnSync(["bun", "install"], { stdout: "inherit" });

	Logger.success("Done creating packages");
}

const isPackageBlockedFromBuilding = (folder: AvailablePackages): boolean =>
	[
		"oas", // only json files
		// "tanstack-react-query", // a little buggy with some type definitions, but we could still build it if we want
	].includes(AvailablePackagesSchema.Enum[folder]);
