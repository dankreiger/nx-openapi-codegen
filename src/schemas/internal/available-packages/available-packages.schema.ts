import { z } from "zod";

export const AvailablePackagesSchema = z.enum([
	"axios",
	"faker-constant",
	"faker-random",
	"fetch",
	"msw-constant",
	"msw-random",
	"oas",
	"redoc",
	"swr",
	"tanstack-react-query",
	"tanstack-solid-query",
	"tanstack-svelte-query",
	"tanstack-vue-query",
	"types",
	"zod",
]);

export type AvailablePackages = z.infer<typeof AvailablePackagesSchema>;
