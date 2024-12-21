import { input } from "@inquirer/prompts";

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
	const config: Parameters<typeof input>[0] = {
		message: "Enter the packages base directory",
		default: "packages",
		required: true,
		validate: (value) => {
			if (value === "config") {
				return "The config directory is reserved for the workspace configuration, please choose a different name";
			}
			if (value.includes(" ")) {
				return "The packages base directory cannot contain spaces";
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

	return normalizePackagesBaseDir(await input(config));
}

const removeTrailingSlash = (value: string) => value.replace(/\/$/, "");
const replaceMultipleSlashes = (value: string) => value.replace(/\/\/+/, "/");

const normalizePackagesBaseDir = (value: string) =>
	removeTrailingSlash(replaceMultipleSlashes(value));
