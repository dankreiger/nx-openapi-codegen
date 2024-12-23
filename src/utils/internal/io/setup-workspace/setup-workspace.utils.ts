import { pipeAsync as pipe, tapAsync as tap } from "async-toolbelt";
import { getMonorepoConfig } from "../../../../prompts/index.ts";
import {
	Logger,
	createCodegenConfig,
	createPackage,
	createWorkspace,
	updateTsconfigJsonBase,
} from "../../index.ts";

export const setupWorkspace = async () => {
	const workspace = await pipe(
		tap(createWorkspace),
		tap(createPackage),
		tap(createCodegenConfig),
		tap(updateTsconfigJsonBase),
	)(await getMonorepoConfig());

	Logger.success("Done setting up workspace");

	return workspace;
};
