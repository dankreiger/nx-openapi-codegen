import { checkbox } from "@inquirer/prompts";
import { AvailablePackagesSchema } from "../../../schemas/index.ts";

/**
 * @returns The selected packages
 * @description This is the list of packages that the user wants to generate
 */
export async function getSelectedPackages() {
	return checkbox({
		message: "Select the packages you want to generate:",
		choices: AvailablePackagesSchema.options.map((pkg) => ({
			name: pkg,
			value: pkg,
		})),
		validate: (answer) => {
			if (answer.length === 0) {
				return "You must select at least one package.";
			}
			return true;
		},
	});
}
