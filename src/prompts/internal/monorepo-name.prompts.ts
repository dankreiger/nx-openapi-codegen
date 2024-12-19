import { input } from "@inquirer/prompts";
import { MonorepoNameSchema } from "../../schemas";

/**
 * @returns The monorepo name
 * @description This is the name of the monorepo
 * @default my-monorepo
 */
export async function getMonorepoName() {
	return MonorepoNameSchema.parse(
		await input({
			message: "Enter the monorepo name:",
			default: "my-monorepo",
		}),
	);
}
