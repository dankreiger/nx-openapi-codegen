import { z } from "zod";

export const MonorepoConfigSchema = z
	.object({
		githubRepoName: z.string().trim(),
		githubOrgName: z.string().trim(),
		openapiUrl: z
			.string()
			.url()
			.trim()
			.default("https://petstore3.swagger.io/api/v3/openapi.json"),
		packagesBaseDirPath: z.string().trim(),
		// selectedPackages: z.array(AvailablePackagesSchema).readonly(),
	})
	.transform((res) => {
		const [_, ...segments] = res.packagesBaseDirPath.split("/");
		return {
			...res,
			codegenConfigDir: `./config/${segments.filter(Boolean).join("/")}`,
			npmOrgScope: `@${res.githubOrgName}` as const,
		};
	})
	.readonly();

export type MonorepoConfig = z.infer<typeof MonorepoConfigSchema>;
export type MonorepoConfigInput = Omit<
	MonorepoConfig,
	"codegenConfigDir" | "npmOrgScope"
>;
