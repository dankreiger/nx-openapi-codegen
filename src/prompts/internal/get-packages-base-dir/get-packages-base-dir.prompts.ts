import { input } from "@inquirer/prompts";
import { BaseDirSchema } from "../../../schemas";

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
export async function getPackagesBaseDir() {
	return BaseDirSchema.parse(
		await input({
			message: "Enter the packages base directory:",
			default: "packages",
		}),
	);
}
