import { input } from "@inquirer/prompts";
import { CONFIG_DIRECTORY_NAME } from "../../../constants/config-directory-name.constants.ts";
import { getNormalizedPath } from "../../../utils/index.ts";

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
	if (Bun.env.RUN_MODE === "quick") return "packages";
	const config: Parameters<typeof input>[0] = {
		message: "Enter the packages base directory",
		default: "packages",
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

	return getNormalizedPath({ path: await input(config) });
}
