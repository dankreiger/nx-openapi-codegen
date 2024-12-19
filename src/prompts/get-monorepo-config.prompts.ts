import { z } from "zod";
import { AvailablePackagesSchema, type MonorepoConfig } from "../schemas";
import {
	getMonorepoName,
	getNpmOrgName,
	getPackagesBaseDir,
	getSelectedPackages,
} from "./internal";

export const MonorepoConfigSchema = z
	.object({
		repoName: z.string(),
		npmOrgName: z.string().regex(/^@\w+$/) as z.ZodType<`@${string}`>,
		packagesBaseDir: z.string(),
		selectedPackages: z.array(AvailablePackagesSchema).readonly(),
	})
	.readonly();

export async function getMonorepoConfig() {
	return {
		repoName: await getMonorepoName(),
		npmOrgName: await getNpmOrgName(),
		packagesBaseDir: await getPackagesBaseDir(),
		selectedPackages: await getSelectedPackages(),
	} as const satisfies MonorepoConfig;
}
