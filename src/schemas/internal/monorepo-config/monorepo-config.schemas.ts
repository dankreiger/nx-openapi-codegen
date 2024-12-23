import { execSync } from "node:child_process";
import type { ReadonlyDeep } from "type-fest";
import { z } from "zod";
import { CONFIG_DIRECTORY_NAME } from "../../../constants/index.ts";
import { getGithubNameByType } from "../../../prompts/internal/index.ts";
import { getNormalizedPath } from "../../../utils/index.ts";
import { ExistingFilePathSchema } from "../../index.ts";
import { OpenapiUrlSchema } from "../openapi-url/index.ts";

export const MonorepoConfigSchema = z
	.object({
		githubRepoName: z.string().trim(),
		githubOrgName: z.string().trim(),
		openapiUrlOrFilePath: OpenapiUrlSchema.or(ExistingFilePathSchema),
		packagesBaseDirPath: z.string().trim(),
	})
	.transform((res) => {
		if (res.githubRepoName === getGithubNameByType({ nameType: "repo" })) {
			execSync(`rimraf ./${res.githubRepoName}`);
		}
		return {
			...res,
			codegenConfigsDir: getNormalizedPath({
				path: `./${CONFIG_DIRECTORY_NAME}/${res.packagesBaseDirPath}`,
			}),
			npmOrgScope: `@${res.githubOrgName}` as const,
		};
	})
	.readonly();

export type MonorepoConfig = ReadonlyDeep<z.infer<typeof MonorepoConfigSchema>>;
export type MonorepoConfigInput = Omit<
	MonorepoConfig,
	"codegenConfigsDir" | "npmOrgScope"
>;
