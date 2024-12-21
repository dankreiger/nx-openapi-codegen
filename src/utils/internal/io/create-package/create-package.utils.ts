import { $, write } from "bun";
import chalk from "chalk";
import type { TsConfigJson } from "type-fest";
import {
	PACKAGE_TSUP_CONFIG_JSON,
	getPackageTsupConfigString,
} from "../../../../constants/package-tsup-config.constants.ts";
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
import { updatePackageJson } from "../update-package-json/index.ts";

export async function createPackage(config: MonorepoConfig) {
	const { githubOrgName, npmOrgScope, packagesBaseDirPath } = config;

	for (const folder of AvailablePackagesSchema.options) {
		const PACKAGE_NAME = `${npmOrgScope}/${folder}` as const;
		const DIRECTORY = `${packagesBaseDirPath}/${folder}`;
		console.log(
			chalk.blue(
				`\n⚡ Generating library for: ${chalk.bold.white(folder)} with prefix: ${chalk.bold.white(githubOrgName)}\n`,
			),
		);

		await $`bun nx reset && bun nx add @nx/js`;

		await $`bunx nx generate @nx/js:library \
      --directory=${DIRECTORY} \
      --importPath=${PACKAGE_NAME} \
      --name=${PACKAGE_NAME} \
      --unitTestRunner=none \
      --linter=none \
			--useProjectJson=false \
			--preset=ts \
      --tags=${getNxPackageTags([folder])} \
      --publishable=true \
			--skipFormat=true \
      --no-interactive`;

		if (folder === "oas") {
			await Bun.$`rm ${DIRECTORY}/src/index.ts`;
			await Bun.write(`${DIRECTORY}/src/index.ts`, "export {}");
		}

		await updateTsConfig({
			directory: DIRECTORY,
			folder,
		});

		await updatePackageJson({
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
					build: "tsup",
					// build: `${folder === "types" ? "" : "tsup  &&"} bun dts`,
					// build: `${folder === "tanstack-react-query" ? "tsup && bun --silent dts" : "tsup"}`,
					// dts: "tsc --emitDeclarationOnly --declaration --declarationDir ./dist --rootDir ./src ./src/index.ts",
					// dts: "bunx tsc --emitDeclarationOnly --project tsconfig.lib.json",
					sort: "sort-package-json",
					typecheck:
						"tsc -p ./tsconfig.json --noEmit --emitDeclarationOnly false",
				},
				engines: {
					node: ">=22",
				},
				devDependencies: {},
				peerDependencies: getPeerDepByFolder(folder),
			},
			path: `${DIRECTORY}/package.json`,
		});

		// Setup biome lint config
		await $`bunx nx g @gitopslovers/nx-biome:configuration --project ${PACKAGE_NAME}`;

		// let tsupConfigToWrite = PACKAGE_TSUP_CONFIG_JSON;
		// if (folder === "tanstack-react-query") {
		// 	tsupConfigToWrite = {
		// 		...PACKAGE_TSUP_CONFIG_JSON,
		// 		// problems with this right now - we'll do it temp via tsc
		// 		dts: folder !== "tanstack-react-query",
		// 	};
		// }
		// Write tsup config
		await write(
			`${DIRECTORY}/tsup.config.ts`,
			getPackageTsupConfigString(PACKAGE_TSUP_CONFIG_JSON),
		);

		await Bun.$`rm -rf ${DIRECTORY}/src/lib`;

		console.log(
			chalk.green(`\n✓ Done generating: ${chalk.bold.white(PACKAGE_NAME)}`),
		);
		console.log(`\t Details: ${getPackageDescriptionByFolder(folder)}`);
	}
}

const updateTsConfig = async (input: {
	directory: string;
	folder: AvailablePackages;
}) => {
	const { directory: DIRECTORY } = input;
	await $`rm ${DIRECTORY}/tsconfig.lib.json`;
	const tsconfigPath = `${DIRECTORY}/tsconfig.json`;

	const tsconfigJson = (await Bun.file(tsconfigPath).json()) as TsConfigJson;

	await Bun.write(
		tsconfigPath,
		JSON.stringify(
			{
				extends: tsconfigJson.extends,
				compilerOptions: {
					allowImportingTsExtensions: true,
				},
			} satisfies TsConfigJson,
			null,
			2,
		),
	);
	// }
};
