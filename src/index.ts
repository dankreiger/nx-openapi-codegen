#!/usr/bin/env bun
import { getMonorepoConfig } from "./prompts";
import { ShellErrorOutputSchema } from "./schemas";
import { createWorkspace, createPackage } from "./utils";

(async () => {
	try {
		const config = await getMonorepoConfig();

		await createWorkspace(config);
		await createPackage(config);

		console.log("\nAll selected libraries generated successfully!");
	} catch (err) {
		const shellError = ShellErrorOutputSchema.safeParse(err);
		if (shellError.success) {
			console.error(shellError.data.stderr);
		} else {
			console.error("An error occurred:\n", err);
		}

		process.exit(1);
	}
})();
