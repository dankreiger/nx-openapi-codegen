import { execSync } from "node:child_process";
import {
	DEFAULT_OPENAPI_URL,
	DEFAULT_PACKAGES_BASE_DIR_PATH,
} from "../constants/index.ts";
import {
	AvailablePackagesSchema,
	MonorepoConfigSchema,
	type SdkLanguage,
	SdkLanguageSchema,
} from "../schemas/index.ts";
import {
	getGithubName,
	getGithubNameByType,
	getOpenapiUrlOrFilePath,
	getSdkLanguages,
	getSelectedPackages,
} from "./internal/index.ts";

export async function getMonorepoConfig() {
	if (Bun.env.RUN_MODE === "skip-prompts") {
		execSync(`npx rimraf ./${getGithubNameByType({ nameType: "repo" })}`);
	}

	if (Bun.env.RUN_MODE === "skip-prompts") {
		return MonorepoConfigSchema.parse({
			githubOrgName: getGithubNameByType({ nameType: "org" }),
			githubRepoName: getGithubNameByType({ nameType: "repo" }),
			openapiUrlOrFilePath: DEFAULT_OPENAPI_URL,
			sdkLanguages: SdkLanguageSchema.options,
			packagesBaseDirPath: DEFAULT_PACKAGES_BASE_DIR_PATH,
			selectedPackages: AvailablePackagesSchema.options,
		} as const);
	}

	let sdkLanguages: SdkLanguage[] = [];
	const getSdkLanguagesAsync = async () => {
		sdkLanguages = await getSdkLanguages();
		return sdkLanguages;
	};

	const res = MonorepoConfigSchema.parse({
		githubOrgName: await getGithubName({ nameType: "org" }),
		githubRepoName: await getGithubName({ nameType: "repo" }),
		openapiUrlOrFilePath: await getOpenapiUrlOrFilePath(),
		sdkLanguages: await getSdkLanguagesAsync(),
		// packagesBaseDirPath: await getPackagesBaseDirPath(),
		packagesBaseDirPath: "packages",
		...(sdkLanguages.includes("typescript")
			? { selectedPackages: await getSelectedPackages() }
			: {}),
	} as const);

	return res;
}
