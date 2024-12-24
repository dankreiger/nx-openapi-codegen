import { pipeAsync as pipe, tapAsync as tap } from "async-toolbelt";
import {
	Logger,
	createCodegenConfig,
	createPackages,
	createWorkspace,
	updateTsconfigJsonBase,
} from "../../index.ts";

export const setupWorkspace = pipe(
	tap(createWorkspace),
	tap(createPackages),
	tap(createCodegenConfig),
	tap(updateTsconfigJsonBase),
	tap(async () => Logger.success("Done setting up workspace")),
);
