import { execSync } from "node:child_process";
import { MonorepoConfigSchema } from "../schemas/index.ts";
import {
	getGithubName,
	getGithubNameByType,
	getOpenapiUrlOrFilePath,
	getPackagesBaseDirPath,
} from "./internal/index.ts";

export async function getMonorepoConfig() {
	if (Bun.env.RUN_MODE === "quick") {
		execSync(`npx rimraf ./${getGithubNameByType({ nameType: "repo" })}`);
	}

	const res = MonorepoConfigSchema.parse({
		githubOrgName: await getGithubName({ nameType: "org" }),
		githubRepoName: await getGithubName({ nameType: "repo" }),
		openapiUrlOrFilePath: await getOpenapiUrlOrFilePath(),
		packagesBaseDirPath: await getPackagesBaseDirPath(),
		// TODO: add getSelectedPackages() prompt
	} as const);

	if (Bun.env.RUN_MODE === "quick") {
		return {
			...res,
			githubRepoName: getGithubNameByType({ nameType: "repo" }),
			githubOrgName: getGithubNameByType({ nameType: "org" }),
		};
	}
	return res;
}
