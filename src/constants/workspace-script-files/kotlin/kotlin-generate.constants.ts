import { version } from "bun";
import type { MonorepoConfig } from "../../../schemas/index.ts";
import type { KotlinWorkspaceScripts } from "../../../schemas/internal/workspace-script-name/kotlin-workspace-script-name.schemas.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const KOTLIN_GENERATE_SCRIPTS = {
	[`./${BASE_DIR_BY_LANG.kotlin}/generate/index.ts` as const]: async (
		config: MonorepoConfig,
	) =>
		config.byLanguage.kotlin
			? /* ts */ `
      import { chmod } from "node:fs/promises";

      
      Bun.spawnSync([
      "bunx",
      "@openapitools/openapi-generator-cli",
      "generate",
      "-i",
      "${config.openapiUrlOrFilePath}",
      "-g",
      "kotlin",
      "-o",
      "./${config.byLanguage.kotlin.packagesDirectoryPath}",
      "-c",
      "${config.byLanguage.kotlin.codegenConfigsDirectoryPath}/openapi-generator-config-kotlin.json",
      "--skip-validate-spec",
      "--additional-properties=useCoroutines=true,library=jvm-retrofit2,serializationLibrary=gson,artifactVersion=${version},publishToGitHubPackages=true",
    ]);

    // Make gradlew executable
    await chmod(
      "./${config.byLanguage.kotlin.packagesDirectoryPath}/gradlew",
      0o755,
    );



    await Bun.write(
      "./${config.byLanguage.kotlin.packagesDirectoryPath}/.gitignore",
      \`
      .gradle
      **/build/
      !src/**/build/

      # Ignore Gradle GUI config
      gradle-app.setting

      # Avoid ignoring Gradle wrapper jar file (.jar files are usually ignored)
      !gradle-wrapper.jar

      # Avoid ignore Gradle wrappper properties
      !gradle-wrapper.properties

      # Cache of project
      .gradletasknamecache

      # Eclipse Gradle plugin generated files
      # Eclipse Core
      .project
      # JDT-specific (Eclipse Java Development Tools)
      .classpath      
      \`,
    );

   
    `
			: "",
} as const satisfies KotlinWorkspaceScripts<"kotlin:generate">;
