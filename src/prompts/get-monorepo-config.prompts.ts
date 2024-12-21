import { MonorepoConfigSchema } from "../schemas/index.ts";
import {
	getGithubName,
	getOpenapiUrl,
	getPackagesBaseDirPath,
} from "./internal/index.ts";

export async function getMonorepoConfig() {
	return MonorepoConfigSchema.parse({
		githubOrgName: await getGithubName({ nameType: "org" }),
		githubRepoName: await getGithubName({ nameType: "repo" }),
		openapiUrl: await getOpenapiUrl(),
		packagesBaseDirPath: await getPackagesBaseDirPath(),
		// selectedPackages: await getSelectedPackages(),
	} as const);
}
