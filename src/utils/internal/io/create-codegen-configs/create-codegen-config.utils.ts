import { mkdir } from "node:fs/promises";
import type { MonorepoConfig } from "../../../../schemas/index.ts";
import { Logger } from "../logger/logger.utils.ts";
import { generateKubbConfig, generateRtkQueryConfig } from "./configs/index.ts";

export async function createCodegenConfig(config: MonorepoConfig) {
	await mkdir(config.codegenConfigsDir, { recursive: true });

	await generateRtkQueryConfig(config);
	await generateKubbConfig(config);

	Logger.doneGenerating("codegen configs");
}
