import { toCamelCase } from "strong-string";
import type { PackageJson } from "type-fest";
import type { MonorepoConfig } from "../../../../../schemas/internal/monorepo-config/index.ts";
import { toOneWordLowerCase } from "../../../mappers/index.ts";

const toPascalCase = (str: string) =>
	toCamelCase(str).replace(/^./, (match) => match.toUpperCase());

export async function generateOpenApiToolsSwiftConfig(config: MonorepoConfig) {
	if (!config.byLanguage.swift) {
		throw new Error(
			"Swift language not found in config, cannot create OpenAPI Tools codegen config.",
		);
	}
	const OneWordLowerCaseGithubOrgName = toOneWordLowerCase(
		config.githubOrgName,
	);
	const PascalGithubOrgName = toPascalCase(config.githubOrgName);
	const OPEN_API_GENERATOR_CONFIG_FILE_NAME =
		"openapi-generator-config-swift.json";

	const CURRENT_VERSION = (
		(await Bun.file("./package.json").json()) as PackageJson
	).version;

	await Bun.write(
		`${config.byLanguage.swift.codegenConfigsDirectoryPath}/${OPEN_API_GENERATOR_CONFIG_FILE_NAME}`,
		JSON.stringify(
			{
				swift: {
					artifactId: PascalGithubOrgName,
					groupId: `com.${OneWordLowerCaseGithubOrgName}`,
					packageName: OneWordLowerCaseGithubOrgName,
					version: CURRENT_VERSION,
					githubUrl: `https://github.com/${config.githubOrgName}/${config.githubRepoName}`,
				},
			},
			null,
			2,
		),
	);
}
