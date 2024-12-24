import { execSync } from "node:child_process";
import {
	DEFAULT_OPENAPI_URL,
	DEFAULT_PACKAGES_BASE_DIR_PATH,
} from "../constants/index.ts";
import {
	AvailablePackagesSchema,
	MonorepoConfigSchema,
} from "../schemas/index.ts";
import {
	getGithubName,
	getGithubNameByType,
	getOpenapiUrlOrFilePath,
	getPackagesBaseDirPath,
	getSelectedPackages,
} from "./internal/index.ts";

export async function getMonorepoConfig() {
	if (Bun.env.RUN_MODE === "quick") {
		execSync(`npx rimraf ./${getGithubNameByType({ nameType: "repo" })}`);
	}

	if (Bun.env.RUN_MODE === "quick") {
		return MonorepoConfigSchema.parse({
			githubOrgName: getGithubNameByType({ nameType: "org" }),
			githubRepoName: getGithubNameByType({ nameType: "repo" }),
			openapiUrlOrFilePath: DEFAULT_OPENAPI_URL,
			packagesBaseDirPath: DEFAULT_PACKAGES_BASE_DIR_PATH,
			selectedPackages: AvailablePackagesSchema.options,
		} as const);
	}

	const res = MonorepoConfigSchema.parse({
		githubOrgName: await getGithubName({ nameType: "org" }),
		githubRepoName: await getGithubName({ nameType: "repo" }),
		openapiUrlOrFilePath: await getOpenapiUrlOrFilePath(),
		packagesBaseDirPath: await getPackagesBaseDirPath(),
		selectedPackages: await getSelectedPackages(),
	} as const);

	return res;
}
