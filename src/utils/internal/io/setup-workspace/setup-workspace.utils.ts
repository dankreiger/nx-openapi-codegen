import { pipe, tap } from "async-toolbelt";
import type { MonorepoConfig } from "../../../../schemas/index.ts";
import {
	Logger,
	createCodegenConfig,
	createTypescriptPackages,
	createWorkspace,
	updateTsconfigJsonBase,
} from "../../index.ts";

export const setupWorkspace = (config: MonorepoConfig) =>
	pipe(
		config,
		tap(createWorkspace),
		tap(createTypescriptPackages),
		tap(createCodegenConfig),
		tap(updateTsconfigJsonBase),
		tap(async () => Logger.success("Done setting up workspace")),
	);
