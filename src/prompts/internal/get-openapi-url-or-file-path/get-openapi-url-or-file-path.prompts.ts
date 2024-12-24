import { input } from "@inquirer/prompts";
import { DEFAULT_OPENAPI_URL } from "../../../constants/index.ts";
import {
	ExistingFilePathSchema,
	OpenapiUrlSchema,
} from "../../../schemas/index.ts";

export async function getOpenapiUrlOrFilePath() {
	if (Bun.env.RUN_MODE === "quick") return DEFAULT_OPENAPI_URL;

	return input({
		message: "Enter the OpenAPI URL or file path:",
		default: DEFAULT_OPENAPI_URL,
		validate: (input) => {
			let result = OpenapiUrlSchema.safeParse(input);
			if (result.success) return true;
			result = ExistingFilePathSchema.safeParse(input);
			if (result.success) return true;

			return result.error.message;
		},
	});
}
