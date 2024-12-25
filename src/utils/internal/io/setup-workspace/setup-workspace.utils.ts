import { pipeAsync as pipe, tapAsync as tap } from "async-toolbelt";
import {
	Logger,
	createCodegenConfig,
	createTypescriptPackages,
	createWorkspace,
	updateTsconfigJsonBase,
} from "../../index.ts";

export const setupWorkspace = pipe(
	tap(createWorkspace),
	tap(createTypescriptPackages),
	tap(createCodegenConfig),
	tap(updateTsconfigJsonBase),
	tap(async () => Logger.success("Done setting up workspace")),
);
