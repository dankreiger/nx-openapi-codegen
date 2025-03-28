#!/usr/bin/env bun
import { pipe, tap } from "async-toolbelt";
import { getMonorepoConfig } from "./prompts/get-monorepo-config.prompts.ts";
import { ShellErrorOutputSchema } from "./schemas/internal/index.ts";
import {
	Logger,
	checkBunInstallation,
	runCodegen,
	setupWorkspace,
} from "./utils/internal/index.ts";

(async () => {
	try {
		await pipe(
			0,
			checkBunInstallation,
			getMonorepoConfig,
			tap(setupWorkspace),
			tap(runCodegen),
			tap(async () =>
				Logger.success("All selected libraries generated successfully!"),
			),
		);
	} catch (err) {
		const shellError = ShellErrorOutputSchema.safeParse(err);
		console.error(shellError.success ? shellError.data.stderr : err);
		process.exit(1);
	}
})();
