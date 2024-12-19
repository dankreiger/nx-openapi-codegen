import { z } from "zod";
import { AvailablePackagesSchema } from "../available-packages";

export const MonorepoConfigSchema = z
	.object({
		repoName: z.string(),
		npmOrgName: z.string().regex(/^@\w+$/) as z.ZodType<`@${string}`>,
		packagesBaseDir: z.string(),
		selectedPackages: z.array(AvailablePackagesSchema).readonly(),
	})
	.readonly();

export type MonorepoConfig = z.infer<typeof MonorepoConfigSchema>;
