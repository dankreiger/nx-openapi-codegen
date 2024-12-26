import { chmod, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { entries, get } from "lodash-es";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../../../../constants/index.ts";
import { WORKSPACE_SCRIPT_FILES } from "../../../../../constants/workspace-script-files/index.ts";
import {
	type MonorepoConfig,
	SdkLanguageSchema,
} from "../../../../../schemas/index.ts";
import { Logger } from "../../logger/logger.utils.ts";

export async function createWorkspaceScripts(config: MonorepoConfig) {
	// Define all script directories in alphabetical order
	async function createFile(
		input: [filepath: string, content: (c: MonorepoConfig) => Promise<string>],
	) {
		const [filepath, content] = input;
		await mkdir(dirname(filepath), { recursive: true });
		await Bun.write(filepath, await content(config));
		await chmod(filepath, 0o755); // Make executable
	}

	await Promise.all(
		SdkLanguageSchema.options.map((lang) =>
			mkdir(`./${get(BASE_DIR_BY_LANG, lang)}`, { recursive: true }),
		),
	);
	// Create .gitkeep file in top level of BASE_DIR_BY_LANG
	await Promise.all(
		SdkLanguageSchema.options.map((lang) =>
			createFile([
				`./${get(BASE_DIR_BY_LANG, lang)}/../.gitkeep`,
				() => Promise.resolve(""),
			]),
		),
	);

	// Create all files
	await Promise.all(
		SdkLanguageSchema.options.map((lang) =>
			entries(get(WORKSPACE_SCRIPT_FILES, lang)).map(createFile),
		),
	);

	Logger.success(
		"\n✓ All TypeScript files have been created and made executable!\n",
	);
}
