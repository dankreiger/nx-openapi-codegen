import { z } from "zod";
import { AvailablePackagesSchema } from "../available-packages";

export const MonorepoConfigSchema = z
	.object({
		repoName: z.string(),
		npmOrgName: z
			.string()
			.refine((r) => r.startsWith("@")) as z.ZodType<`@${string}`>,
		openapiPath: z
			.string()
			.default("https://petstore3.swagger.io/api/v3/openapi.json"),
		packagesBaseDir: z.string(),
		selectedPackages: z.array(AvailablePackagesSchema).readonly(),
	})
	.transform((res) => {
		const [_, ...segments] = res.packagesBaseDir.split("/");
		return {
			...res,
			kubbConfigDir: `./config/${segments.filter(Boolean).join("/")}`,
		};
	})
	.readonly();

export type MonorepoConfig = z.infer<typeof MonorepoConfigSchema>;
