import { execSync } from "node:child_process";
import path from "node:path";
import type { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import { CONFIG_DIRECTORY_NAME } from "../../../constants/index.ts";
import { getGithubNameByType } from "../../../prompts/internal/index.ts";
import {
	AvailablePackagesSchema,
	ExistingFilePathSchema,
	FilePathSchema,
	parseFilePath,
} from "../../index.ts";
import { OpenapiUrlSchema } from "../openapi-url/openapi-url.schemas.ts";
import { SdkLanguageSchema } from "../sdk-language/sdk-language.schemas.ts";

export const MonorepoConfigSchema = z
	.object({
		githubRepoName: z.string().trim(),
		githubOrgName: z.string().trim(),
		openapiUrlOrFilePath: OpenapiUrlSchema.or(ExistingFilePathSchema),
		sdkLanguages: z.array(SdkLanguageSchema),
		packagesBaseDirPath: FilePathSchema,
		selectedPackages: z.array(AvailablePackagesSchema).readonly(),
	})
	.transform((res) => {
		if (res.githubRepoName === getGithubNameByType({ nameType: "repo" })) {
			execSync(`npx rimraf ./${res.githubRepoName}`);
		}

		const codegenConfigsDir = parseFilePath(
			path.join(CONFIG_DIRECTORY_NAME, res.packagesBaseDirPath),
		);

		const codegenConfigPathOffset = parseFilePath(
			"../".repeat(res.packagesBaseDirPath.split("/").length + 2),
		);

		return {
			...res,
			codegenConfigsDir,
			codegenConfigPathOffset,
			npmOrgScope: `@${res.githubOrgName}` as const,
		};
	})
	.readonly();

export type MonorepoConfig = ReadonlyDeep<z.infer<typeof MonorepoConfigSchema>>;
export type MonorepoConfigInput = Omit<
	MonorepoConfig,
	"codegenConfigsDir" | "npmOrgScope"
>;
