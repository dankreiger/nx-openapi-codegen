import { input } from "@inquirer/prompts";
import { CONFIG_DIRECTORY_NAME } from "../../../constants/config-directory-name.constants.ts";
import { DEFAULT_PACKAGES_BASE_DIR_PATH } from "../../../constants/index.ts";
import { parseFilePath } from "../../../schemas/index.ts";

/**
 * @returns The packages base directory
 * @description This is the directory where the packages will be created
 * @example
 * - packages
 * - src/packages
 * - packages/my-package
 *
 * @default packages
 */
export async function getPackagesBaseDirPath() {
	if (Bun.env.RUN_MODE === "skip-prompts") return "packages";
	const config: Parameters<typeof input>[0] = {
		message: "Enter the packages base directory",
		default: DEFAULT_PACKAGES_BASE_DIR_PATH,
		required: true,
		validate: (value) => {
			if (value.includes(" ")) {
				return "The packages base directory cannot contain spaces";
			}
			if (value === CONFIG_DIRECTORY_NAME) {
				return `The "${CONFIG_DIRECTORY_NAME}" directory is reserved for the workspace configuration, please choose a different name`;
			}
			return true;
		},
	};

	if (process.env.NODE_ENV === "test") {
		return {
			config,
			result: "noop",
		};
	}

	return parseFilePath(await input(config));
}
