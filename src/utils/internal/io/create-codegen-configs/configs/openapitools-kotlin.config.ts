import { toKebabCase } from "strong-string";
import type { PackageJson } from "type-fest";
import type { MonorepoConfig } from "../../../../../schemas/internal/monorepo-config/index.ts";

export async function generateOpenApiToolsKotlinConfig(config: MonorepoConfig) {
	if (!config.byLanguage.kotlin) {
		throw new Error(
			"Kotlin language not found in config, cannot create OpenAPI Tools codegen config.",
		);
	}
	const KebabGithubOrgName = toKebabCase(config.githubOrgName);
	const OPEN_API_GENERATOR_CONFIG_FILE_NAME =
		"openapi-generator-config-kotlin.json";

	const CURRENT_VERSION = (
		(await Bun.file("./package.json").json()) as PackageJson
	).version;

	await Bun.write(
		`${config.byLanguage.kotlin.codegenConfigsDirectoryPath}/${OPEN_API_GENERATOR_CONFIG_FILE_NAME}`,
		JSON.stringify(
			{
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
