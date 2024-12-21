import { z } from "zod";

export const AvailablePackagesSchema = z.enum([
	"axios",
	"faker-constant",
	"faker-random",
	"fetch",
	"msw-constant",
	"msw-random",
	"oas",
	"swr",
	"tanstack-react-query",
	"types",
	"zod",
]);

export type AvailablePackages = z.infer<typeof AvailablePackagesSchema>;
