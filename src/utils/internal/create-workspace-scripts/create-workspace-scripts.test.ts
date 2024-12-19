import { afterEach, describe, expect, jest, test } from "bun:test";
import { write } from "bun";
import { WORKSPACE_SCRIPT_FILES } from "../../../constants";
import { createWorkspaceScripts } from "./create-workspace-scripts.utils";

describe("createWorkspaceScripts", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("creates all scripts and .gitkeep file", async () => {
		await createWorkspaceScripts();
		// Writes expected scripts + 1 `.gitkeep` file
		expect(write).toHaveBeenCalledTimes(
			Object.keys(WORKSPACE_SCRIPT_FILES).length + 1,
		);
	});
});
