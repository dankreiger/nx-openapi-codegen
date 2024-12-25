import { checkbox } from "@inquirer/prompts";
import { AvailablePackagesSchema } from "../../../schemas/index.ts";

/**
 * @returns The selected packages
 * @description This is the list of packages that the user wants to generate
 */
export async function getSelectedTypescriptSdks() {
	return checkbox({
		message:
			"Select the typescript SDKs you want to generated\n  (Note that 'faker' and 'types' packages will \n  always be generated since other packages require them)",
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
