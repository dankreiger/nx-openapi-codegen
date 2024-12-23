import { input } from "@inquirer/prompts";
import type { z } from "zod";
import { GithubOrgOrRepoNameSchema } from "../../../schemas/index.ts";

export const getGithubNameByType = (promptInput: {
	nameType: "repo" | "org";
}) => `my-${promptInput.nameType}` as const;

/**
 * @returns The github name format (organization or repository)
 */
export const getGithubName = (promptInput: { nameType: "repo" | "org" }) => {
	const config: Parameters<typeof input>[0] = {
		default: getGithubNameByType(promptInput),
		message: `Enter the github ${promptInput.nameType} name`,
		required: true,
		validate: (validationInput) => {
			const result = GithubOrgOrRepoNameSchema.safeParse(validationInput);

			return result.success || formatZodErrors(result.error);
		},
	};

	const ret = process.env.NODE_ENV === "test" ? "noop" : input(config);

	return Object.assign(ret, { config });
};

const formatZodErrors = (errors: z.ZodError) =>
	errors.errors.map((error) => error.message).join("\n");
