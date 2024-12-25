import type {
	MonorepoConfig,
	PackageScriptName,
	PackageSubpath,
} from "../schemas/index.ts";
import { getNxPackageTags } from "../utils/index.ts";
import { getPackagesNotToBuildString } from "../utils/internal/mappers/get-packages-not-to-build/get-packages-not-to-build.utils.ts";
import {
	WORKSPACE_SCRIPTS_BASE_DIR as BASE_DIR,
	type WORKSPACE_SCRIPTS_BASE_DIR,
} from "./workspace-scripts-base-dir.constants.ts";

// Define all files and their contents
export const WORKSPACE_SCRIPT_FILES = {
	// ==================
	// = Boom Commands  =
	// ==================
	[`./${BASE_DIR}/boom/index.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
console.log("Finding and removing all node_modules and dist directories...");
Bun.spawnSync(["find", ".", "-name", "node_modules", "-type", "d", "-prune", "-print", "-exec", "rm", "-rf", "{}", "+"], { stdout: "inherit" });
Bun.spawnSync(["find", ".", "-name", "dist", "-type", "d", "-prune", "-print", "-exec", "rm", "-rf", "{}", "+"], { stdout: "inherit" });

console.log("Removing transient files...");
Bun.spawnSync(["bunx", "rimraf", "tmp"], { stdout: "inherit" });      // tmp files
Bun.spawnSync(["bunx", "rimraf", "docs"], { stdout: "inherit" });     // typedoc
Bun.spawnSync(["bunx", "rimraf", "coverage"], { stdout: "inherit" }); // jest coverage
Bun.spawnSync(["bunx", "rimraf", "target"], { stdout: "inherit" });   // rust
Bun.spawnSync(["bunx", "rimraf", ".nx"], { stdout: "inherit" });      // nx cache

console.log("Cleanup complete.");`,

	[`./${BASE_DIR}/boom/refresh.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bun", "run", "boom"], { stdout: "inherit" });
Bun.spawnSync(["bun", "pm", "cache", "rm"], { stdout: "inherit" });
Bun.spawnSync(["rm", "bun.lockb"], { stdout: "inherit" });
Bun.spawnSync(["bun", "install"], { stdout: "inherit" });`,

	// ==================
	// = Build Command  =
	// ==================

	[`./${BASE_DIR}/build/index.ts`]: (
		config: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "nx", "run-many", "--target=build", "--projects=tag:${getNxPackageTags()}", "--exclude=tag:${getPackagesNotToBuildString({ config, outputAs: "string" })}"], { stdout: "inherit" });`,

	// ===================
	// = Commit Commands =
	// ===================
	[`./${BASE_DIR}/commit/index.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "cz"], { stdout: "inherit" });`,
	[`./${BASE_DIR}/commit/protect.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
const currentBranch = (Bun.spawnSync(["git", "rev-parse", "--abbrev-ref", "HEAD"], {
  stdout: "pipe",
}).stdout.text()).trim();

// Check if we're on the main branch and not in a CI environment
if (currentBranch === "main" && !process.env.CI) {
  console.log("\\n\\x1b[41m\\x1b[97m===========================================================================\\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m ERROR: Direct commits to the 'main' branch are prohibited!                \\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m Please switch to a feature branch for your changes.                       \\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m Use 'git checkout -b <branch-name>' to create and switch to a new branch. \\x1b[0m");
  console.log("\\x1b[41m\\x1b[97m===========================================================================\\x1b[0m\\n\\n");
  process.exit(1);
}

console.log(\`Committing to \${currentBranch}\`);`,

	// =================
	// = Docs Command  =
	// =================
	[`./${BASE_DIR}/docs/index.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "typedoc"], { stdout: "inherit" });`,

	// =====================
	// = Generate Command  =
	// =====================
	[`./${BASE_DIR}/generate/index.ts`]: (config: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
	import { replaceInFile } from 'replace-in-file'

	const srcTsFiles = new Bun.Glob("${config.packagesBaseDirPath}/**/src/**/*.ts");
	const srcTsFolders = new Bun.Glob("${config.packagesBaseDirPath}/**/src/**/");
	const distDirs = new Bun.Glob("${config.packagesBaseDirPath}/**/dist");

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
	${config.selectedPackages.includes("rtk-query") ? `Bun.spawnSync(["bunx", "@rtk-query/codegen-openapi", "${config.codegenConfigsDir}/rtk-query.config.json"], { stdout: "inherit" });` : ""}
	Bun.spawnSync(["bunx", "kubb", "generate", "--config", "${`${config.codegenConfigsDir}/kubb.config.ts`}"], { stdout: "inherit" });
	// Import from faker-random inside of msw-random
	${config.selectedPackages.includes("msw-random") ? /* ts */ `await replaceInFile({ files: '${config.packagesBaseDirPath}/msw-random/src/*.ts', from: ['faker-constant', '(data))', '() {'], to: ['faker-random', '())', '(data?: any) {'] })` : ""}
	${config.selectedPackages.includes("msw-constant") || config.selectedPackages.includes("msw-random") ? /*ts*/ `await replaceInFile({ files: '${config.packagesBaseDirPath}/msw-*/src/*.ts', from: ['(data))'], to: ['())', '(data?: any) {'] })` : ""}
	
	Bun.spawnSync(["bunx", "biome", "check", "--write", "--unsafe"], { stdout: "inherit" });
`,

	[`./${BASE_DIR}/generate/refresh.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
		Bun.spawnSync(["bun", "boom:refresh"], { stdout: "inherit" });
		Bun.spawnSync(["rm", "bun.lockb"], { stdout: "inherit" });
		Bun.spawnSync(["rm -rf .nx"], { stdout: "inherit" });
		Bun.spawnSync(["bun", "install"], { stdout: "inherit" });
		Bun.spawnSync(["bun", "run", "generate"], { stdout: "inherit" });
`,

	// ==================
	// = Lint Commands  =
	// ==================
	[`./${BASE_DIR}/lint/index.ts`]: (_: MonorepoConfig) =>
		/* ts */ `Bun.spawnSync(["biome", "lint", "--write", "--unsafe"], { stdout: "inherit" });`,

	// ==========================
	// = Local Registry Commands =
	// ==========================
	[`./${BASE_DIR}/local-registry/start.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "verdaccio"], { stdout: "inherit" });`,

	[`./${BASE_DIR}/local-registry/publish.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
const registry = "http://localhost:4873";

// Set registry
Bun.spawnSync(["npm", "config", "set", "registry", registry], { stdout: "inherit" });

// Build all packages
Bun.spawnSync(["bun", "run", "build"], { stdout: "inherit" });

// Publish all packages
Bun.spawnSync([
  "bunx", 
  "nx",
  "release",
  "publish",
  "--registry", 
  registry,
  "--tag",
  "latest"
], { stdout: "inherit" });

// Reset registry to npm
Bun.spawnSync(["npm", "config", "set", "registry", "https://registry.npmjs.org"], { stdout: "inherit" });`,

	[`./${BASE_DIR}/local-registry/stop.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "pm2", "stop", "verdaccio"], { stdout: "inherit" });
Bun.spawnSync(["bunx", "pm2", "delete", "verdaccio"], { stdout: "inherit" });`,

	// ====================
	// = Release Commands =
	// ====================
	[`./${BASE_DIR}/release/index.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
	process.env.LEFTHOOK = "0";

Bun.spawnSync(["bunx", "nx", "release", "-y"], { stdout: "inherit" });`,

	[`./${BASE_DIR}/release/dry-run.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
process.env.LEFTHOOK = "0";
Bun.spawnSync(["bunx", "nx", "release", "--dry-run", "--skip-publish"], { stdout: "inherit" });`,

	// ==================
	// = Sort Commands  =
	// ==================
	[`./${BASE_DIR}/sort/index.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
Bun.spawnSync(["bunx", "nx", "run-many", "--target=sort", "--projects=tag:${getNxPackageTags()}"], { stdout: "inherit" });`,
} satisfies Record<
	`./${typeof WORKSPACE_SCRIPTS_BASE_DIR}/${PackageSubpath<PackageScriptName>}`,
	(config: MonorepoConfig) => string
>;
