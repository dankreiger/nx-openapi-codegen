#!/usr/bin/env bun
import chalk from "chalk";
import { pipe } from "rxjs";
import { getMonorepoConfig } from "./prompts";
import { ShellErrorOutputSchema } from "./schemas";
import { createPackage, createWorkspace } from "./utils";

const logSuccess = pipe(chalk.green, console.log);

(async () => {
	try {
		const config = await getMonorepoConfig();

		await createWorkspace(config);
		await createPackage(config);
		await Bun.$`bun generate`;

		logSuccess`\n✓ All selected libraries generated successfully!\n`;
	} catch (err) {
		const shellError = ShellErrorOutputSchema.safeParse(err);
		console.error(shellError.success ? shellError.data.stderr : err);

		process.exit(1);
	}
})();
