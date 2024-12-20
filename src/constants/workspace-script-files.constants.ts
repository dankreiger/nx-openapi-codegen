import type { MonorepoConfig, WorkspaceScriptsPath } from "../schemas";
import { getNxPackageTags } from "../utils";
import { WORKSPACE_SCRIPTS_BASE_DIR as BASE_DIR } from "./workspace-scripts-base-dir.constants";

// Define all files and their contents
export const WORKSPACE_SCRIPT_FILES = {
	// ==================
	// = Boom Commands  =
	// ==================
	[`./${BASE_DIR}/boom/index.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
console.log("Finding and removing all node_modules and dist directories...");
await Bun.spawn(["find", ".", "-name", "node_modules", "-type", "d", "-prune", "-print", "-exec", "rm", "-rf", "{}", "+"]);
await Bun.spawn(["find", ".", "-name", "dist", "-type", "d", "-prune", "-print", "-exec", "rm", "-rf", "{}", "+"]);

console.log("Removing transient files...");
await Bun.spawn(["bunx", "rimraf", "tmp"]);      // tmp files
await Bun.spawn(["bunx", "rimraf", "docs"]);     // typedoc
await Bun.spawn(["bunx", "rimraf", "coverage"]); // jest coverage
await Bun.spawn(["bunx", "rimraf", "target"]);   // rust
await Bun.spawn(["bunx", "rimraf", ".nx"]);      // nx cache

console.log("Cleanup complete.");`,

	[`./${BASE_DIR}/boom/refresh.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn(["bun", "run", "boom"]);
await Bun.spawn(["bun", "pm", "cache", "rm"]);
await Bun.spawn(["rm", "bun.lockb"]);
await Bun.spawn(["bun", "install"]);`,

	// ==================
	// = Build Command  =
	// ==================

	[`./${BASE_DIR}/build/index.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn(["bunx", "nx", "run-many", "--target=build", "--projects=tag:${getNxPackageTags()}"]);`,

	// ===================
	// = Commit Commands =
	// ===================
	[`./${BASE_DIR}/commit/index.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn(["bunx", "cz"]);`,
	[`./${BASE_DIR}/commit/protect.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
const currentBranch = (await Bun.spawn(["git", "rev-parse", "--abbrev-ref", "HEAD"], {
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
await Bun.spawn(["bunx", "typedoc"]);`,

	// =====================
	// = Generate Command  =
	// =====================
	[`./${BASE_DIR}/generate/index.ts`]: (config: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn([
	"bunx",
	"kubb",
	"generate",
	"--config",
	"${`${config.kubbConfigDir}/kubb.config.ts`.replaceAll("//", "/")}"
])`,

	[`./${BASE_DIR}/generate/refresh.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn(["bun", "run", "generate"]);
await Bun.spawn(["bun", "boom:refresh"]);
await Bun.spawn(["rm", "bun.lockb"]);
await Bun.spawn(["rm -rf .nx"]);
await Bun.spawn(["bun", "install"]);
`,

	// ==================
	// = Lint Commands  =
	// ==================
	[`./${BASE_DIR}/lint/index.ts`]: (_: MonorepoConfig) =>
		`await Bun.spawn(["bunx", "nx", "run-many", "--target=biome-lint", "--write=true", "--projects=tag:${getNxPackageTags()}"]);`,

	// ==========================
	// = Local Registry Commands =
	// ==========================
	[`./${BASE_DIR}/local-registry/start.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn(["bunx", "verdaccio"]);`,

	[`./${BASE_DIR}/local-registry/publish.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
const registry = "http://localhost:4873";

// Set registry
await Bun.spawn(["npm", "config", "set", "registry", registry]);

// Build all packages
await Bun.spawn(["bun", "run", "build"]);

// Publish all packages
await Bun.spawn([
  "bunx", 
  "nx",
  "release",
  "publish",
  "--registry", 
  registry,
  "--tag",
  "latest"
]);

// Reset registry to npm
await Bun.spawn(["npm", "config", "set", "registry", "https://registry.npmjs.org"]);`,

	[`./${BASE_DIR}/local-registry/stop.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn(["bunx", "pm2", "stop", "verdaccio"]);
await Bun.spawn(["bunx", "pm2", "delete", "verdaccio"]);`,

	// ====================
	// = Release Commands =
	// ====================
	[`./${BASE_DIR}/release/index.ts`]: (_: MonorepoConfig) =>
		/* ts */ `${"#!/usr/bin/env bun"}
	process.env.LEFTHOOK = "0";

await Bun.spawn(["bunx", "nx", "release", "-y"]);`,

	[`./${BASE_DIR}/release/dry-run.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
process.env.LEFTHOOK = "0";
await Bun.spawn(["bunx", "nx", "release", "--dry-run", "--skip-publish"]);`,

	// ==================
	// = Sort Commands  =
	// ==================
	[`./${BASE_DIR}/sort/index.ts`]: (
		_: MonorepoConfig,
	) => /* ts */ `${"#!/usr/bin/env bun"}
await Bun.spawn(["bunx", "nx", "run-many", "--target=sort", "--projects=tag:${getNxPackageTags()}"]);`,
} satisfies Record<WorkspaceScriptsPath, (config: MonorepoConfig) => string>;
