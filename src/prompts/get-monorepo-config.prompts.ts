import { MonorepoConfigSchema } from "../schemas";
import {
	getMonorepoName,
	getNpmOrgName,
	getOpenapiPath,
	getPackagesBaseDir,
	getSelectedPackages,
} from "./internal";

export async function getMonorepoConfig() {
	return MonorepoConfigSchema.parse({
		repoName: await getMonorepoName(),
		npmOrgName: await getNpmOrgName(),
		openapiPath: await getOpenapiPath(),
		packagesBaseDir: await getPackagesBaseDir(),
		selectedPackages: await getSelectedPackages(),
	} as const);
}
