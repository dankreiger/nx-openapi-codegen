import type { MonorepoConfig } from "../../../../../schemas/index.ts";
import { Logger } from "../../logger/logger.utils.ts";

export async function createWorkspaceNx(config: MonorepoConfig) {
	await Bun.spawnSync(
		[
			"bunx",
			"create-nx-workspace@20.3.0",
			config.githubRepoName,
			"--preset=ts",
			"--formatter=none",
			"--linter=none",
			"--strict=true",
			"--nxCloud=skip",
			"--pm=bun",
			"--useGitHub=true",
		],
		{
			stdout: "inherit",
		},
	);

	process.chdir(config.githubRepoName);
	Logger.success("Done creating workspace");
}
