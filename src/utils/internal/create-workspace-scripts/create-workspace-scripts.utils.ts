import { chmod, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import chalk from "chalk";
import {
	WORKSPACE_SCRIPTS_BASE_DIR as BASE_DIR,
	SCRIPT_DIRECTORIES,
	WORKSPACE_SCRIPT_FILES as SCRIPT_FILES,
} from "../../../constants";

export async function createWorkspaceScripts() {
	// Define all script directories in alphabetical order

	async function createFile(filepath: string, content: string) {
		await mkdir(dirname(filepath), { recursive: true });
		await Bun.write(filepath, content);
		await chmod(filepath, 0o755); // Make executable
	}

	// Create directories
	await Promise.all(
		SCRIPT_DIRECTORIES.map((dir) =>
			mkdir(`./${BASE_DIR}/${dir}`, { recursive: true }),
		),
	);

	// Create .gitkeep file in top level of BASE_DIR
	await createFile(`./${BASE_DIR}/../.gitkeep`, "");

	// Create all files
	await Promise.all(
		Object.entries(SCRIPT_FILES).map(([filepath, content]) =>
			createFile(filepath, content),
		),
	);

	console.log(
		chalk.green(
			"\n✓ All TypeScript files have been created and made executable!\n",
		),
	);
}
