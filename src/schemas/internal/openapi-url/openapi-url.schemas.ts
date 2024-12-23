import { z } from "zod";

export const OpenapiUrlSchema = z
	.string()
	.url()
	.trim()
	.default("https://petstore3.swagger.io/api/v3/openapi.json");
