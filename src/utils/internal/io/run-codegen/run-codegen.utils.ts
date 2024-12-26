import {
	type MonorepoConfig,
	SdkLanguageSchema,
} from "../../../../schemas/index.ts";
import { repairFiles } from "../repair-files/index.ts";

export const runCodegen = async (_: MonorepoConfig) => {
	// Generate
	for (const lang of SdkLanguageSchema.options) {
		const generateResult = Bun.spawnSync(
			["bun", "--bun", "run", `${lang}:generate`],
			{
				stdout: "inherit",
			},
		);

		if (generateResult.exitCode !== 0) {
			throw new Error(`Generate step failed for ${lang}`);
		}
	}

	// Lint and format
	await repairFiles();

	// Build
	const buildResult = Bun.spawnSync(["bun", "run", "typescript:build"], {
		stdout: "inherit",
	});

	if (buildResult.exitCode !== 0) {
		throw new Error("Build step failed");
	}
};
