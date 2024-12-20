import { input } from "@inquirer/prompts";

export async function getOpenapiPath() {
	return input({
		message:
			"Enter the OpenAPI path (remote URL or local file path relative to root):",
		default: "https://petstore3.swagger.io/api/v3/openapi.json",
	});
}
