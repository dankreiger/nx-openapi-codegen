import type { MonorepoConfig } from "../../../schemas/index.ts";
import type { SwiftWorkspaceScripts } from "../../../schemas/internal/workspace-script-name/swift-workspace-script-name.schemas.ts";
import { toOneWordLowerCase } from "../../../utils/index.ts";
import { WORKSPACE_SCRIPTS_BASE_DIR_BY_LANG as BASE_DIR_BY_LANG } from "../../workspace-scripts-base-dir.constants.ts";

export const SWIFT_GENERATE_SCRIPTS = {
	[`./${BASE_DIR_BY_LANG.swift}/generate/index.ts` as const]: async (
		config: MonorepoConfig,
	) =>
		config.byLanguage.swift
			? /* ts */ `Bun.spawnSync([
      "bunx",
      "@openapitools/openapi-generator-cli",
      "generate",
      "-i",
      "${config.openapiUrlOrFilePath}",
      "-g",
      "swift5",
      "-o",
      "./${config.byLanguage.swift.packagesDirectoryPath}",
      "-c", 
      "${config.byLanguage.swift.codegenConfigsDirectoryPath}/openapi-generator-config-swift.json",
      "--skip-validate-spec",
      "--additional-properties=responseAs=AsyncAwait,swift5UseSPMFileStructure=true,projectName=${toOneWordLowerCase(config.githubOrgName)},packageName=${toOneWordLowerCase(config.githubOrgName)},swiftPackagePath=${toOneWordLowerCase(config.githubOrgName)},useGitHub=true"])`
			: "",

	[`./${BASE_DIR_BY_LANG.swift}/publish/index.ts` as const]: async (
		_: MonorepoConfig,
	) => "console.log('TODO: add github actions publish for swift')",
} as const satisfies SwiftWorkspaceScripts<"swift:generate" | "swift:publish">;
