import { toCamelCase, toKebabCase, toLowerCase } from "strong-string";
import type { PackageJson } from "type-fest";
import type { MonorepoConfig } from "../../../../../schemas/internal/monorepo-config/index.ts";

const toOneWordLowerCase = (str: string) =>
	toLowerCase(str).replaceAll("-", "").replaceAll("_", "");

const toPascalCase = (str: string) =>
	toCamelCase(str).replace(/^./, (match) => match.toUpperCase());

export async function generateOpenApiToolsConfig(config: MonorepoConfig) {
	const OneWordLowerCaseGithubOrgName = toOneWordLowerCase(
		config.githubOrgName,
	);
	const KebabGithubOrgName = toKebabCase(config.githubOrgName);
	const PascalGithubOrgName = toPascalCase(config.githubOrgName);
	const OPEN_API_GENERATOR_CONFIG_FILE_NAME = "openapi-generator-config.json";

	const CURRENT_VERSION = (
		(await Bun.file("./package.json").json()) as PackageJson
	).version;

	await Bun.write(
		`${config.codegenConfigsDir}/openapitools/${OPEN_API_GENERATOR_CONFIG_FILE_NAME}`,
		JSON.stringify(
			{
				swift: {
					artifactId: PascalGithubOrgName,
					groupId: `com.${OneWordLowerCaseGithubOrgName}`,
					packageName: OneWordLowerCaseGithubOrgName,
					version: CURRENT_VERSION,
					githubUrl: `https://github.com/${config.githubOrgName}/${config.githubRepoName}`,
				},
				kotlin: {
					artifactId: KebabGithubOrgName,
					groupId: `com.${KebabGithubOrgName}.api`,
					packageName: `com.${KebabGithubOrgName}.api`,
					version: CURRENT_VERSION,
					mavenRepository: `https://maven.pkg.github.com/${config.githubOrgName}/${config.githubRepoName}`,
				},
			},
			null,
			2,
		),
	);
}
