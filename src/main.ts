#!/usr/bin/env bun
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

		// Setup workspace
		await setupWorkspace();

		// Run build steps
		await runBuildSteps();

		Logger.success("All selected libraries generated successfully!");
	} catch (err) {
		const shellError = ShellErrorOutputSchema.safeParse(err);
		console.error(shellError.success ? shellError.data.stderr : err);
		process.exit(1);
	}
})();
