import type { MonorepoConfig } from "../types";
import {
	getMonorepoName,
	getNpmOrgName,
	getPackagesBaseDir,
	getSelectedPackages,
} from "./internal";

export async function getMonorepoConfig() {
	return {
		repoName: await getMonorepoName(),
		npmOrgName: await getNpmOrgName(),
		packagesBaseDir: await getPackagesBaseDir(),
		selectedPackages: await getSelectedPackages(),
	} as const satisfies MonorepoConfig;
}
