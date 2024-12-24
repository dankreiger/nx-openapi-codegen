#!/usr/bin/env bun
import { getMonorepoConfig } from "./prompts/get-monorepo-config.prompts.ts";
import { ShellErrorOutputSchema } from "./schemas/internal/index.ts";
import {
	Logger,
	checkBunInstallation,
	runBuildSteps,
	setupWorkspace,
} from "./utils/internal/index.ts";

(async () => {
	try {
		// Check Bun installation
		await checkBunInstallation();

		// Get monorepo config
		const config = await getMonorepoConfig();

		// Setup workspace
		await setupWorkspace(config);

		// Run build steps
		await runBuildSteps(config);

		Logger.success("All selected libraries generated successfully!");
	} catch (err) {
		const shellError = ShellErrorOutputSchema.safeParse(err);
		console.error(shellError.success ? shellError.data.stderr : err);
		process.exit(1);
	}
})();
