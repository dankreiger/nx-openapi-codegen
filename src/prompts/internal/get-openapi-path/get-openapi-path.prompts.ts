import { input } from "@inquirer/prompts";
import { z } from "zod";

const OpenApiUrlSchema = z
	.string()
	.url("The OpenAPI URL must be a valid URL")
	.regex(/^.*\.json|\.yaml$/, "The OpenAPI URL must end with .json or .yaml");
export async function getOpenapiUrl() {
	return input({
		message: "Enter the OpenAPI URL:",
		default: "https://petstore3.swagger.io/api/v3/openapi.json",
		validate: (input) => {
			const result = OpenApiUrlSchema.safeParse(input);
			if (result.success) {
				return true;
			}
			return result.error.message;
		},
	});
}
