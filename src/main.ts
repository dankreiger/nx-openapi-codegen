#!/usr/bin/env bun
import chalk from "chalk";
import type { TsConfigJson } from "type-fest";
import { getMonorepoConfig } from "./prompts/index.ts";
import { ShellErrorOutputSchema } from "./schemas/index.ts";
import { createPackage, createWorkspace } from "./utils/index.ts";

const SUCCESS = chalk.green`\n✓ All selected libraries generated successfully!\n`;

(async () => {
	try {
		const config = await getMonorepoConfig();

		await createWorkspace(config);
		await createPackage(config);

		const tsconfigPath = "./tsconfig.base.json";
		const tsconfigFile = Bun.file(tsconfigPath);
		const tsconfigJson = (await tsconfigFile.json()) as TsConfigJson;
		const { incremental, composite, ...compilerOptionsWithoutIncremental } =
			tsconfigJson.compilerOptions || {};

		await Bun.write(
			tsconfigPath,
			JSON.stringify(
				{
					...tsconfigJson,
					compilerOptions: {
						// ...compilerOptionsWithoutIncremental,

						lib: ["DOM", "DOM.Iterable", "ES2023"],
						module: "NodeNext",
						moduleResolution: "NodeNext",
						noEmit: true,
					},
				} satisfies TsConfigJson,
				null,
				2,
			),
		);

		// delete all packages/**/src/index.ts files
		// await Bun.$`find packages -type f -name "src/index.ts" -exec rm {} \;`;

		// run kubb
		await Bun.$`bun generate`;

		// run biome
		await Bun.$`bunx biome check --write --unsafe`;

		// run build
		await Bun.$`bun run build`;

		console.log(SUCCESS);
	} catch (err) {
		const shellError = ShellErrorOutputSchema.safeParse(err);
		console.error(shellError.success ? shellError.data.stderr : err);

		process.exit(1);
	}
})();
