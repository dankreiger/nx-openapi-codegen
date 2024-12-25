import { execSync } from "node:child_process";
import path from "node:path";
import { keys } from "strong-object";
import type { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import {
	CONFIG_DIRECTORY_NAME,
	DEFAULT_PACKAGES_BASE_DIR_PATH,
} from "../../../constants/index.ts";
import { getGithubNameByType } from "../../../prompts/internal/index.ts";
import {
	AvailablePackagesSchema,
	ExistingFilePathSchema,
	parseFilePath,
} from "../../index.ts";
import { MonorepoConfigByLanguageSchema } from "../monorepo-config-by-language/index.ts";
import { OpenapiUrlSchema } from "../openapi-url/openapi-url.schemas.ts";
import {
	type SdkLanguage,
	SdkLanguageSchema,
} from "../sdk-language/sdk-language.schemas.ts";

export const MonorepoConfigSchema = z
	.object({
		/**
		 * @description
		 * The name of the github repo that can be found in the URL:
		 * 
		 * In this example, the repo-name is "my-repo"
		 * https://github.com/org/my-repo

		 */
		githubRepoName: z.string().trim(),
		/**
		 * @description
		 * The name of the github org that can be found in the URL:
		 *
		 * In this example, the org-name is "my-org"
		 * https://github.com/my-org/my-repo
		 */
		githubOrgName: z.string().trim(),
		/**
		 * @description
		 * The URL of the OpenAPI spec file or the path to the file.
		 */
		openapiUrlOrFilePath: OpenapiUrlSchema.or(ExistingFilePathSchema),
		/**
		 * @description
		 * The programming languages to generate SDKs for.
		 */
		sdkLanguages: z.array(SdkLanguageSchema).readonly(),
		/**
		 * @description
		 * The selected typescript SDKs.
		 */
		selectedTypescriptSdks: z.array(AvailablePackagesSchema).readonly(),
	})
	.transform(({ sdkLanguages, ...res }) => {
		if (res.githubRepoName === getGithubNameByType({ nameType: "repo" })) {
			execSync(`npx rimraf ./${res.githubRepoName}`);
		}

		/**
		 * @description
		 * The offset of the codegen config path from the root of the monorepo.
		 * RTK config uses this to determine the path to the codegen config. The others do not need it.
		 */
		const rtkCodegenOffsetPathToWorkspaceRoot = parseFilePath(
			"../".repeat(DEFAULT_PACKAGES_BASE_DIR_PATH.split("/").length + 2),
		);

		return {
			...res,
			npmOrgScope: `@${res.githubOrgName}` as const,
			byLanguage: z
				.record(SdkLanguageSchema, MonorepoConfigByLanguageSchema)
				.refine((obj) => keys(obj).length, {
					message:
						"At least one language must be present in the byLanguage object",
				})
				.parse(
					sdkLanguages.reduce(
						(acc, language) => {
							const base = {
								codegenConfigsDirectoryPath: parseFilePath(
									path.join(
										CONFIG_DIRECTORY_NAME,
										DEFAULT_PACKAGES_BASE_DIR_PATH,
										language,
									),
								),
								packagesDirectoryPath: parseFilePath(
									path.join(DEFAULT_PACKAGES_BASE_DIR_PATH, language),
								),
								language,
							};

							if (language === "typescript") {
								acc[language] = {
									...base,
									rtkCodegenOffsetPathToWorkspaceRoot,
									selectedTypescriptSdks: res.selectedTypescriptSdks,
								};
							} else {
								acc[language] = {
									...base,
									language,
								};
							}
							return acc;
						},
						{} as Record<
							SdkLanguage,
							z.infer<typeof MonorepoConfigByLanguageSchema>
						>,
					),
				),
		} as const;
	})
	.readonly();

export type MonorepoConfig = ReadonlyDeep<z.infer<typeof MonorepoConfigSchema>>;
