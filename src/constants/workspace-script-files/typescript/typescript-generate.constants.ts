import type { MonorepoConfig } from "../../../schemas/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const TYPESCRIPT_GENERATE_SCRIPTS = {
	/**
	 * Generate the workspace
	 *
	 * This means that we:
	 * - Clean up generated files
	 * - Install dependencies
	 * - Run the rtk-query codegen
	 * - Run the kubb codegen
	 * - Run the msw codegen
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/generate/index.ts` as const]: async (
		config: MonorepoConfig,
	) =>
		config.byLanguage.typescript
			? /* ts */ `
			import { replaceInFile } from "replace-in-file";
		const srcTsFiles = new Bun.Glob("${config.byLanguage.typescript.packagesDirectoryPath}/**/src/**/*.ts");
		const srcTsFolders = new Bun.Glob("${config.byLanguage.typescript.packagesDirectoryPath}/**/src/**/");
		const distDirs = new Bun.Glob("${config.byLanguage.typescript.packagesDirectoryPath}/**/dist");

		console.log("🧹 Cleaning up generated files...");
		const files: string[] = [];
		for await (const file of srcTsFiles.scan(".")) {
			if (!file.endsWith("index.ts")) files.push(file);
		}
		Bun.spawnSync(["bunx", "rimraf", ...files], { stdout: "inherit" });

		const folders: string[] = [];
		for await (const folder of srcTsFolders.scan(".")) {
			folders.push(folder);
		}
		Bun.spawnSync(["bunx", "rimraf", ...folders], { stdout: "inherit" });

		const dists: string[] = [];
		for await (const dirs of distDirs.scan(".")) {
			dists.push(dirs);
		}
		Bun.spawnSync(["bunx", "rimraf", ...dists], { stdout: "inherit" });

		Bun.spawnSync(["bun", "install"], { stdout: "inherit" });
		
		${
			config.selectedTypescriptSdks.includes("rtk-query")
				? /* ts */ `Bun.spawnSync(["bunx", "@rtk-query/codegen-openapi", "${config.byLanguage.typescript.codegenConfigsDirectoryPath}/rtk-query.config.json"], { stdout: "inherit" });`
				: ""
		}
		Bun.spawnSync(["bunx", "kubb", "generate", "--config", "${config.byLanguage.typescript.codegenConfigsDirectoryPath}/kubb.config.ts"], { stdout: "inherit" });
		
		${
			config.selectedTypescriptSdks.includes("msw-random")
				? /* ts */ `await replaceInFile({ files: '${config.byLanguage.typescript.packagesDirectoryPath}/msw-random/src/*.ts', from: ['faker-constant', '(data))', '() {'], to: ['faker-random', '())', '(data?: any) {'] })`
				: ""
		}
		${
			config.selectedTypescriptSdks.includes("msw-constant") ||
			config.selectedTypescriptSdks.includes("msw-random")
				? /* ts */ `await replaceInFile({ files: '${config.byLanguage.typescript.packagesDirectoryPath}/msw-*/src/*.ts', from: ['(data))'], to: ['())', '(data?: any) {'] })`
				: ""
		}`
			: "",

	/**
	 * Refresh the workspace and run the generate script
	 *
	 * Refreshing means that we:
	 * - Run the boom:refresh script
	 * - Remove the bun.lockb file
	 * - Remove the .nx directory
	 * - Run the generate script
	 */
	[`./${BASE_DIR_BY_LANG.typescript}/generate/refresh.ts` as const]: async (
		_: MonorepoConfig,
	) =>
		/* ts */ `${"#!/usr/bin/env bun"}
        Bun.spawnSync(["bun", "boom:refresh"], { stdout: "inherit" });
        Bun.spawnSync(["rm", "bun.lockb"], { stdout: "inherit" });
        Bun.spawnSync(["rm -rf .nx"], { stdout: "inherit" });
        Bun.spawnSync(["bun", "install"], { stdout: "inherit" });
        Bun.spawnSync(["bun", "typescript:generate"], { stdout: "inherit" });
`,
} as const;
