import { repairFiles } from "../repair-files/index.ts";

export const runBuildSteps = async () => {
	// Generate
	const generateResult = Bun.spawnSync(["bun", "--bun", "run", "generate"], {
		stdout: "inherit",
	});

	if (generateResult.exitCode !== 0) {
		throw new Error("Generate step failed");
	}

	// Lint and format
	await repairFiles();

	// Build
	const buildResult = Bun.spawnSync(["bun", "run", "build"], {
		stdout: "inherit",
	});

	if (buildResult.exitCode !== 0) {
		throw new Error("Build step failed");
	}
};
