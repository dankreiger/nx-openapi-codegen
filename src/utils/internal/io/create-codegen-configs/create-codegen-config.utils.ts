import { mkdir } from "node:fs/promises";
import path from "node:path";
import { CONFIG_DIRECTORY_NAME } from "../../../../constants/index.ts";
import type { MonorepoConfig } from "../../../../schemas/index.ts";
import { Logger } from "../logger/logger.utils.ts";
import {
	generateKubbConfig,
	generateOpenApiToolsKotlinConfig,
	generateOpenApiToolsSwiftConfig,
	generateRtkQueryConfig,
} from "./configs/index.ts";

export async function createCodegenConfig(config: MonorepoConfig) {
	await mkdir(CONFIG_DIRECTORY_NAME, { recursive: true });
	await Bun.write(path.join(CONFIG_DIRECTORY_NAME, ".gitkeep"), "");
	for (const { packagesDirectoryPath } of Object.values(config.byLanguage)) {
		await mkdir(packagesDirectoryPath, { recursive: true });
		await Bun.write(path.join(packagesDirectoryPath, ".gitkeep"), "");
	}

	if (config.byLanguage.kotlin) await generateOpenApiToolsKotlinConfig(config);
	if (config.byLanguage.swift) await generateOpenApiToolsSwiftConfig(config);
	if (config.byLanguage.typescript) {
		await generateRtkQueryConfig(config);
		await generateKubbConfig(config);
	}

	Logger.doneGenerating("codegen configs");
}
