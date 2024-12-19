import { input } from "@inquirer/prompts";
import { MonorepoNameSchema } from "../../../schemas";

export async function getMonorepoName() {
	return MonorepoNameSchema.parse(
		await input({
			message: "Enter the monorepo name:",
			default: "my-monorepo",
		}),
	);
}
